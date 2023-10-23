package com.breadsb.notesapp.services;

import jakarta.servlet.AsyncContext;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.internal.LoadingCache;
import org.springframework.stereotype.Service;

import java.time.Instant;

public interface LoginAttemptService {
    boolean canAttemptNow(String user);
    Instant cantAttemptAfter(String user);
    void registerFailedAttempt(String user);
    void clearHistory(String name);
    void addToWaitingQueue(String name, AsyncContext chainNAsyncContext);
}
