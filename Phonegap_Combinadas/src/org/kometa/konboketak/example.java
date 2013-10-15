package org.kometa.konboketak;

import android.os.Bundle;
import android.view.WindowManager;

import org.apache.cordova.*;
import org.kometa.konboketak.R;


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