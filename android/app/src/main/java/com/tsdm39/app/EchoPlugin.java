package com.tsdm39.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@CapacitorPlugin(name = "Echo")
public class EchoPlugin extends Plugin {
    static final char[] f2701b = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

    @PluginMethod()
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        if (value != null) {
            try {
                byte[] bytes = value.getBytes();
                MessageDigest messageDigest = MessageDigest.getInstance("MD5");
                messageDigest.update(bytes);
                ret.put("value", a(messageDigest.digest()));
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }

        } else {
            ret.put("value", null);
        }
        ret.put("raw", value);
        call.resolve(ret);
    }

    public static String a(byte[] bArr) {
        char[] cArr = new char[bArr.length * 2];
        int i = 0;
        for (byte b2 : bArr) {
            int i2 = i + 1;
            cArr[i] = f2701b[(b2 >>> 4) & 15];
            i = i2 + 1;
            cArr[i2] = f2701b[b2 & 15];
        }
        return new String(cArr);
    }
}
