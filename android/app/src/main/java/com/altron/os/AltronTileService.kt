package com.altron.os

import android.app.PendingIntent
import android.app.StatusBarManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.drawable.Icon
import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import androidx.annotation.RequiresApi
import java.util.concurrent.Executor

/**
 * ALTRON OS Quick Settings Tile Service
 * 
 * Official native Android TileService API implementation for quick-launching
 * the ALTRON AI Operating System directly from the Android Quick Settings
 * and notification drawer.
 */
class AltronTileService : TileService() {

    override fun onTileAdded() {
        super.onTileAdded()
        updateTileState(Tile.STATE_ACTIVE)
    }

    override fun onStartListening() {
        super.onStartListening()
        // Ensure tile is active and ready whenever user pulls down Quick Settings
        updateTileState(Tile.STATE_ACTIVE)
    }

    override fun onStopListening() {
        super.onStopListening()
    }

    override fun onTileRemoved() {
        super.onTileRemoved()
    }

    /**
     * Called when user taps the ALTRON OS tile in Android Quick Settings.
     * Launches the centralized ALTRON OS interface directly.
     */
    override fun onClick() {
        super.onClick()

        // Create launch intent targeting the main ALTRON OS interface
        val launchIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or 
                    Intent.FLAG_ACTIVITY_SINGLE_TOP or 
                    Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(EXTRA_LAUNCH_SOURCE, "quick_settings_tile")
            putExtra(EXTRA_ACTIVATE_VOICE, true)
        }

        // Android 14+ / Q+ safe unlock and activity collapse
        if (isLocked) {
            unlockAndRun {
                startAltronActivity(launchIntent)
            }
        } else {
            startAltronActivity(launchIntent)
        }
    }

    @Suppress("DEPRECATION")
    private fun startAltronActivity(intent: Intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // Android 14 (API 34)+ uses PendingIntent for starting activity from TileService
            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            startActivityAndCollapse(pendingIntent)
        } else {
            startActivityAndCollapse(intent)
        }
    }

    private fun updateTileState(state: Int) {
        qsTile?.let { tile ->
            tile.state = state
            tile.label = "ALTRON OS"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                tile.subtitle = "Voice & Controls"
            }
            tile.updateTile()
        }
    }

    companion object {
        const val EXTRA_LAUNCH_SOURCE = "com.altron.os.LAUNCH_SOURCE"
        const val EXTRA_ACTIVATE_VOICE = "com.altron.os.ACTIVATE_VOICE"

        /**
         * Dynamic Tile Request API (Android 13 / API 33+)
         * Requests Android to prompt the user to add the ALTRON tile to Quick Settings directly.
         */
        @RequiresApi(Build.VERSION_CODES.TIRAMISU)
        fun requestAddTile(
            context: Context,
            executor: Executor,
            onResult: (Int) -> Unit
        ) {
            val statusBarManager = context.getSystemService(StatusBarManager::class.java)
            val componentName = ComponentName(context, AltronTileService::class.java)

            statusBarManager?.requestAddTileService(
                componentName,
                "ALTRON OS",
                Icon.createWithResource(context, android.R.drawable.ic_btn_speak_now),
                executor
            ) { resultCode ->
                // resultCode can be:
                // StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_ADDED (1)
                // StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_ALREADY_ADDED (2)
                // StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_NOT_ADDED (3)
                onResult(resultCode)
            }
        }
    }
}
