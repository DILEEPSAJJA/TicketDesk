package com.ticketdesk.dto;

import com.ticketdesk.entity.Status;

public class StatusCountDto {

    private Status status;
    private long count;

    public StatusCountDto() {
    }

    public StatusCountDto(Status status, long count) {
        this.status = status;
        this.count = count;
    }

    public static StatusCountDtoBuilder builder() {
        return new StatusCountDtoBuilder();
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public static class StatusCountDtoBuilder {
        private Status status;
        private long count;

        public StatusCountDtoBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public StatusCountDtoBuilder count(long count) {
            this.count = count;
            return this;
        }

        public StatusCountDto build() {
            return new StatusCountDto(status, count);
        }
    }
}
