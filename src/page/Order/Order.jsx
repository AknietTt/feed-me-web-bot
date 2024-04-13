import React, { useEffect, useState } from 'react';

export default function Order() {
    const [jsonData, setJsonData] = useState('');

    useEffect(() => {
        // Проверяем, что объект существует
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
            // Преобразуем объект в JSON строку с отступами
            const formattedData = JSON.stringify(window.Telegram.WebApp.initData, null, 2);
            // Сохраняем отформатированную строку в состоянии
            setJsonData(formattedData);
        }
    }, []);

    return (
        <div>
            <div>Order</div>
            <pre>{jsonData}</pre> {/* Отображаем JSON внутри тега <pre>, чтобы сохранить форматирование */}
        </div>
    );
}
