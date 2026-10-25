
package archive.honar;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(BazaarUpdatePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
