echo "🚀 starting Frontend..."
cd frontend && npm run dev &
if [ $? -ne 0 ]; then
    echo "❌ Frontend failed to start"
    exit 1
fi

echo "🚀 starting Backend..."
cd backend && sbt run &
if [ $? -ne 0 ]; then
    echo "❌ Backend failed to start"
    exit 1
fi

trap ctrl_c INT

function ctrl_c() {
    echo "🛑 Завершуємо процеси frontend ($FRONTEND_PID) та backend ($BACKEND_PID)..."
    kill -INT "$FRONTEND_PID" "$BACKEND_PID"
    wait
    echo "✅ Процеси завершені."
    exit 0
}

wait
