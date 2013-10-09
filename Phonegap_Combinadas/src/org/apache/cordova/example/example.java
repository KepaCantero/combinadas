package org.apache.cordova.example;

import android.os.Bundle;
import android.view.WindowManager;

import org.apache.cordova.*;


public class example extends DroidGap
{
	
	@Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/index.html", 3000);
    }
}