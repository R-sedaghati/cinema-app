
package archive.honar;

import com.farsitel.bazaar.updater.BazaarUpdater;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BazaarUpdate")
public class BazaarUpdatePlugin extends Plugin {

    @PluginMethod
    public void checkForUpdate(PluginCall call) {
        BazaarUpdater.getLastUpdateState(getContext(), result -> {
            JSObject response = new JSObject();

            if (result.isAlreadyUpdated()) {
                response.put("status", "upToDate");
                call.resolve(response);
                return;
            }

            if (result.isUpdateNeeded()) {
                response.put("status", "updateAvailable");
                response.put(
                    "targetVersionCode",
                    result.getTargetVersionCode()
                );
                call.resolve(response);
                return;
            }

            String message = "Unable to check for updates.";

            if (result.getError() != null
                && result.getError().getMessage() != null) {
                message = result.getError().getMessage();
            }

            call.reject(message);
        });
    }

    @PluginMethod
    public void startUpdate(PluginCall call) {
        try {
            BazaarUpdater.updateApplication(getContext());
            call.resolve();
        } catch (Exception error) {
            String message = error.getMessage();

            if (message == null) {
                message = "Unable to open Bazaar update flow.";
            }

            call.reject(message);
        }
    }
}
