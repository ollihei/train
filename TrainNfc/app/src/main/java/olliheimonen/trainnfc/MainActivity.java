package olliheimonen.trainnfc;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.Ndef;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

/**
 * Tutorial used: https://code.tutsplus.com/tutorials/reading-nfc-tags-with-android--mobile-17278
 */
public class MainActivity extends AppCompatActivity {

    private NfcAdapter mNfcAdapter;
    private PendingIntent nfcPendingIntent;
    private IntentFilter[] intentFiltersArray;
    private TextView infoField;
    private TextView urlField;
    private TextView idField;
    private RequestQueue queue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.queue = Volley.newRequestQueue(getApplicationContext());
        setContentView(R.layout.activity_main);

        infoField = (TextView) findViewById(R.id.info);
        idField = (TextView) findViewById(R.id.id);
        urlField = (TextView) findViewById(R.id.url);

        mNfcAdapter = NfcAdapter.getDefaultAdapter(this);

        Intent nfcIntent = new Intent(this, getClass());
        nfcIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        nfcPendingIntent =
                PendingIntent.getActivity(this, 0, nfcIntent, 0);

        IntentFilter tagIntentFilter =
                new IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED);
        try {
            tagIntentFilter.addDataType("text/plain");
            intentFiltersArray = new IntentFilter[]{tagIntentFilter};
        } catch (Throwable t) {
            t.printStackTrace();
        }

        handleIntent(getIntent());
    }

    protected void onNewIntent(Intent intent) {
        handleIntent(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        setupForegroundDispatch(this, mNfcAdapter);
    }

    @Override
    protected void onPause() {
        stopForegroundDispatch(this, mNfcAdapter);
        super.onPause();
    }

    public static void setupForegroundDispatch(final Activity activity, NfcAdapter adapter) {
        final Intent intent = new Intent(activity.getApplicationContext(), activity.getClass());
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        final PendingIntent pendingIntent = PendingIntent.getActivity(activity.getApplicationContext(), 0, intent, 0);

        IntentFilter[] filters = new IntentFilter[1];
        String[][] techList = new String[][]{};

        filters[0] = new IntentFilter();
        filters[0].addAction(NfcAdapter.ACTION_NDEF_DISCOVERED);
        filters[0].addCategory(Intent.CATEGORY_DEFAULT);
        try {
            filters[0].addDataType("text/plain");
        } catch (IntentFilter.MalformedMimeTypeException e) {
            throw new RuntimeException("Check your mime type.");
        }

        adapter.enableForegroundDispatch(activity, pendingIntent, filters, techList);
    }

    public static void stopForegroundDispatch(final Activity activity, NfcAdapter adapter) {
        adapter.disableForegroundDispatch(activity);
    }

    private void handleIntent(Intent intent) {
        try {
            if (intent == null) {
                Log.i("Test", "Intent q" +
                        "was null");
                return;
            }
            Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            new NdefReaderTask().execute(tag);
        } catch (Exception exception) {
            Log.e("Test", "Error: \" + exception");
            // infoField.append("\nError: " + exception);
        }
    }

    class NdefReaderTask extends AsyncTask<Tag, Void, String> {
        @Override
        protected String doInBackground(Tag... params) {
            try {

                if (params[0] == null) {
                    Log.i("Test", "Was null");
                    return "";
                }
                Log.i("Test", "Was not null");
                Tag tag = params[0];

                Ndef ndef = Ndef.get(tag);
                if (ndef == null) {
                    return "";
                }

                NdefMessage ndefMessage = ndef.getCachedNdefMessage();

                NdefRecord[] records = ndefMessage.getRecords();
                for (NdefRecord ndefRecord : records) {
                    if (ndefRecord.getTnf() == NdefRecord.TNF_WELL_KNOWN && Arrays.equals(ndefRecord.getType(), NdefRecord.RTD_TEXT)) {
                        try {
                            String string = readText(ndefRecord);
                            // infoField.append("\nContent: " + string);
                            return string;
                        } catch (UnsupportedEncodingException e) {
                            Log.e("TrainNfc", "Unsupported Encoding", e);
                        }
                    }
                }

            } catch (Exception exception) {
                infoField.append("\nError: " + exception);
            }
            return "";
        }

        private String readText(NdefRecord record) throws UnsupportedEncodingException {
            byte[] payload = record.getPayload();
            String textEncoding = ((payload[0] & 128) == 0) ? "UTF-8" : "UTF-16";
            int languageCodeLength = payload[0] & 0063;
            return new String(payload, languageCodeLength + 1, payload.length - languageCodeLength - 1, textEncoding);
        }

        @Override
        protected void onPostExecute(final String result) {

            if (result.isEmpty()) return;

            runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            infoField.append("\nContent: " + result);


                            String url = "http://" + urlField.getText() + "/trainlocation?id=" + idField.getText() + "&tag=" + result;
                            infoField.append("\nMaking request to " + url);
                            StringRequest stringRequest = new StringRequest(Request.Method.GET,
                                    url,
                                    new Response.Listener<String>() {
                                        @Override
                                        public void onResponse(String response) {
                                            // Display the first 500 characters of the response string.
                                            infoField.append("\nResponse is: " + response);
                                        }
                                    }, new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    infoField.append("\nError when sending data: " + error);
                                }
                            });

                            stringRequest.setShouldCache(false);
                            queue.add(stringRequest);
                        }
                    }
            );
        }
    }
}
