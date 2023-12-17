package com.tsdm39.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ClientHashPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
