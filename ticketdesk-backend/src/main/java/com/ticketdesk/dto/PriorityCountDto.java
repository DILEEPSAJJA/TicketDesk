package com.ticketdesk.dto;

import com.ticketdesk.entity.Priority;

public class PriorityCountDto {

    private Priority priority;
    private long count;

    public PriorityCountDto() {
    }

    public PriorityCountDto(Priority priority, long count) {
        this.priority = priority;
        this.count = count;
    }

    public static PriorityCountDtoBuilder builder() {
        return new PriorityCountDtoBuilder();
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public static class PriorityCountDtoBuilder {
        private Priority priority;
        private long count;

        public PriorityCountDtoBuilder priority(Priority priority) {
            this.priority = priority;
            return this;
        }

        public PriorityCountDtoBuilder count(long count) {
            this.count = count;
            return this;
        }

        public PriorityCountDto build() {
            return new PriorityCountDto(priority, count);
        }
    }
}
