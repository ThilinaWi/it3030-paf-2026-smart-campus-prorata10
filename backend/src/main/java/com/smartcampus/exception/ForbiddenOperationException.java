package com.smartcampus.exception;

/**
 * Exception thrown when a user attempts an operation they are not allowed to perform.
 */
public class ForbiddenOperationException extends RuntimeException {

    public ForbiddenOperationException(String message) {
        super(message);
    }
}
