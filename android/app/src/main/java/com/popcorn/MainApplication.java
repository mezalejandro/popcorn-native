package com.popcorn;

import android.app.Application;
import android.os.StrictMode;

import com.facebook.react.ReactApplication;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.tripss.updaternapp.UpdateRNAppPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.futurepress.staticserver.FPStaticServerPackage;
import com.ghondar.torrentstreamer.*;
import com.github.yamill.orientation.OrientationPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.googlecast.GoogleCastPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new WebRTCModulePackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RandomBytesPackage(),
            new RNOSModule(),
                    new RNGestureHandlerPackage(),
                    new SplashScreenReactPackage(),
                    new RNLanguagesPackage(),
                    new UpdateRNAppPackage(),
                    new VectorIconsPackage(),
                    new RNFSPackage(),
                    new FPStaticServerPackage(),
                    new TorrentStreamerPackage(),
                    new OrientationPackage(),
                    new ReactVideoPackage(),
                    new LinearGradientPackage(),
                    new GoogleCastPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        try {
            Method m = StrictMode.class.getMethod("disableDeathOnFileUriExposure");
            m.invoke(null);
        } catch (Exception e) {
            e.printStackTrace();
        }

        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
