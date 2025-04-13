package com.system.Library_Backend.exceptions;

public class MaxLoans extends RuntimeException {
    public MaxLoans() {
        super("Maximum number of active loans reached: " + 3);
    } 
}
