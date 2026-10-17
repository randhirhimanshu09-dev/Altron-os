package com.altron.os

import android.content.Intent
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * Main Activity hosting the centralized ALTRON AI OS interface.
 * Handles launches from Android Quick Settings Tile, home-screen widgets,
 * and voice activation intents without creating duplicate interfaces.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                mediaPlaybackRequiresUserGesture = false
                cacheMode = WebSettings.LOAD_DEFAULT
            }
            webViewClient = WebViewClient()
            webChromeClient = object : WebChromeClient() {
                // Grant microphone permissions automatically within ALTRON OS container
                override fun onPermissionRequest(request: PermissionRequest?) {
                    request?.grant(request.resources)
                }
            }
        }

        setContentView(webView)
        handleLaunchIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        intent?.let { handleLaunchIntent(it) }
    }

    private fun handleLaunchIntent(intent: Intent) {
        val activateVoice = intent.getBooleanExtra(AltronTileService.EXTRA_ACTIVATE_VOICE, false)
        val targetUrl = if (activateVoice) {
            "https://ais-pre-6qn3priaswvq5unrltez6s-233928667016.asia-southeast1.run.app/?action=voice"
        } else {
            "https://ais-pre-6qn3priaswvq5unrltez6s-233928667016.asia-southeast1.run.app/"
        }

        if (webView.url.isNullOrEmpty()) {
            webView.loadUrl(targetUrl)
        } else if (activateVoice) {
            // Signal running web interface to trigger central voice assistant directly
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('ALTRON_EXTERNAL_VOICE_TRIGGER'))", null)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
