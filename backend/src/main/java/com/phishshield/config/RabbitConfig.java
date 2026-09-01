package com.phishshield.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String DEEP_SCAN_QUEUE = "deep_scan_queue";
    public static final String DEEP_SCAN_RESULTS_QUEUE = "deep_scan_results_queue";
    public static final String EXCHANGE_NAME = "phishshield.exchange";
    public static final String DEEP_SCAN_ROUTING_KEY = "deep.scan.request";
    public static final String DEEP_SCAN_RESULT_ROUTING_KEY = "deep.scan.result";

    @Bean
    public Queue deepScanQueue() {
        return QueueBuilder.durable(DEEP_SCAN_QUEUE).build();
    }

    @Bean
    public Queue deepScanResultsQueue() {
        return QueueBuilder.durable(DEEP_SCAN_RESULTS_QUEUE).build();
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding deepScanBinding(Queue deepScanQueue, DirectExchange exchange) {
        return BindingBuilder.bind(deepScanQueue).to(exchange).with(DEEP_SCAN_ROUTING_KEY);
    }

    @Bean
    public Binding deepScanResultsBinding(Queue deepScanResultsQueue, DirectExchange exchange) {
        return BindingBuilder.bind(deepScanResultsQueue).to(exchange).with(DEEP_SCAN_RESULT_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
