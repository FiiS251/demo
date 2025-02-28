package com.task05;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.Collections;
import java.util.Map;

public class Response {
    private int statusCode;
    private ApiHandler.Event event;

    public Response(int statusCode, ApiHandler.Event event) {
        this.statusCode = statusCode;
        this.event = event;
    }

    public void setEvent(ApiHandler.Event event) {
        this.event = event;
    }

    public ApiHandler.Event getEvent() {
        return event;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }

    @Override
    public String toString() {
        return "{"
                + "\"statusCode\": " + statusCode + ","
                + "\"event\": " + getEvent().toString()
                + "}";
    }
}
