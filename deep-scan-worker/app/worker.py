import os
import json
import time
import logging
import pika
from app.fetcher import DeepScanFetcher

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("deep-scan-worker")

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "phishshield")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "phishshield")
QUEUE_NAME = os.getenv("RABBITMQ_QUEUE", "deep_scan_queue")
REPLY_QUEUE_NAME = os.getenv("RABBITMQ_REPLY_QUEUE", "deep_scan_results_queue")

def start_worker():
    fetcher = DeepScanFetcher()
    logger.info(f"Starting Deep Scan Worker, connecting to RabbitMQ at {RABBITMQ_HOST}:{RABBITMQ_PORT}...")

    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials,
        heartbeat=60,
        blocked_connection_timeout=300
    )

    while True:
        try:
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()

            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            channel.queue_declare(queue=REPLY_QUEUE_NAME, durable=True)

            def callback(ch, method, properties, body):
                try:
                    payload = json.loads(body.decode("utf-8"))
                    analysis_id = payload.get("analysisId")
                    target_url = payload.get("targetUrl")

                    logger.info(f"Received Deep Scan job for Analysis ID: {analysis_id} (URL: {target_url})")

                    inspection_result = fetcher.inspect_url(target_url)

                    reply_payload = {
                        "analysisId": analysis_id,
                        "status": inspection_result.get("status", "COMPLETE"),
                        "finalDestinationUrl": inspection_result.get("finalUrl", target_url),
                        "redirectHops": inspection_result.get("redirectHops", 0),
                        "ssrfBlocked": inspection_result.get("ssrfBlocked", False),
                        "enrichedIndicators": inspection_result.get("indicators", []),
                        "errorMessage": None
                    }

                    # Publish response
                    ch.basic_publish(
                        exchange="",
                        routing_key=REPLY_QUEUE_NAME,
                        body=json.dumps(reply_payload).encode("utf-8"),
                        properties=pika.BasicProperties(delivery_mode=2)
                    )

                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    logger.info(f"Completed Deep Scan job for Analysis ID: {analysis_id}")
                except Exception as e:
                    logger.error(f"Error processing deep scan job: {e}", exc_info=True)
                    ch.basic_ack(delivery_tag=method.delivery_tag)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)

            logger.info("Deep Scan Worker listening for inspection jobs...")
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError as e:
            logger.warning(f"RabbitMQ connection failed: {e}. Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            logger.error(f"Worker encountered unexpected error: {e}. Retrying in 5 seconds...", exc_info=True)
            time.sleep(5)

if __name__ == "__main__":
    start_worker()
