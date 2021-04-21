find dist/ -name '*.base' | while read filename; do 
    export jsname=$(echo $filename | sed -e 's|\.base||'); cp $filename $jsname; 

    sed -i \
        -e "s|%OC_BUYER_CLIENT_ID%|${OC_BUYER_CLIENT_ID}|g" \
        -e "s|%OC_BASE_API_URL%|${OC_BASE_API_URL}|g" \
        -e "s|%layoutServiceHost%|$PROXY_API_HOST|g" \
        -e "s|%firebaseMessagingSenderId%|$REACT_APP_FIREBASE_SENDER_ID|g" \
        -e "s|%firebaseMessagingPushKey%|$REACT_APP_FIREBASE_MESSAGING_PUSH_KEY|g" \
        -e "s|%firebaseProjectId%|$REACT_APP_FIREBASE_PROJECT_ID|g" \
        -e "s|%firebaseApiKey%|$REACT_APP_FIREBASE_API_KEY|g" \
        -e "s|%firebaseAppId%|$REACT_APP_FIREBASE_APP_ID|g" \
        -e "s|%googleApiKey%|$REACT_APP_GOOGLE_API_KEY|g" \
    $jsname;
done