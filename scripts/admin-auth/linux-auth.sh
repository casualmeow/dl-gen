read -p "Enter Admin Hash: " HASH

API_URL="http://localhost/api/authorize-admin" # TODO: change localhost to the actual domain

RESPONSE=$(curl -X POST -d "$HASH" "$API_URL")

echo "$RESPONSE"

if [ "$RESPONSE" == "true" ]; then
    echo "Admin authorized"
else
    echo "Admin not authorized"
fi