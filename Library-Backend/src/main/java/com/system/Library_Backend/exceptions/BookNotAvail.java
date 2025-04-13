package com.system.Library_Backend.exceptions;

public class BookNotAvail extends RuntimeException {
    public BookNotAvail() {
        super("Book is not available for loan");
    }
}
