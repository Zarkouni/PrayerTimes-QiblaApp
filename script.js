// قائمة الدول باللغتين العربية والإنجليزية
const countryTranslations = {
    "مصر": "Egypt",
    "السعودية": "Saudi Arabia",
    "الإمارات": "United Arab Emirates",
    "المغرب": "Morocco",
    "الجزائر": "Algeria",
    "العراق": "Iraq",
    "الأردن": "Jordan",
    "الكويت": "Kuwait",
    "لبنان": "Lebanon",
    "ليبيا": "Libya",
    "تونس": "Tunisia",
    "قطر": "Qatar",
    "البحرين": "Bahrain",
    "عمان": "Oman",
    "السودان": "Sudan",
    "اليمن": "Yemen"
    // أضف المزيد من الدول حسب الحاجة
};

// جلب أوقات الصلاة بناءً على الدولة والمدينة
function getPrayerTimes() {
    const countryInput = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    // تحويل اسم الدولة من العربية إلى الإنجليزية
    const country = countryTranslations[countryInput] || countryInput;

    if (country && city) {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const times = data.data.timings;
                displayPrayerTimes(times);

                // جلب علم الدولة
                getCountryFlag(country);
            })
            .catch(error => console.log('Error fetching prayer times:', error));
    } else {
        alert('يرجى إدخال الدولة والمدينة');
    }
}

// جلب أوقات الصلاة بناءً على الموقع الجغرافي
function getPrayerTimesByCoordinates(latitude, longitude) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const times = data.data.timings;
            displayPrayerTimes(times);
        })
        .catch(error => console.log('Error fetching prayer times by location:', error));
}

// عرض أوقات الصلاة في الصفحة
function displayPrayerTimes(times) {
    const prayerTimesDiv = document.getElementById('prayer-times');
    prayerTimesDiv.innerHTML = `
        <ul>
            <li>الفجر: ${times.Fajr}</li>
            <li>الشروق: ${times.Sunrise}</li>
            <li>الظهر: ${times.Dhuhr}</li>
            <li>العصر: ${times.Asr}</li>
            <li>المغرب: ${times.Maghrib}</li>
            <li>العشاء: ${times.Isha}</li>
        </ul>
    `;
}

// جلب علم الدولة
function getCountryFlag(country) {
    const flagUrl = `https://restcountries.com/v3.1/name/${country}?fullText=true`;

    fetch(flagUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('لم يتم العثور على الدولة');
            }
            return response.json();
        })
        .then(data => {
            const flagImgUrl = data[0].flags.png;
            const flagDiv = document.getElementById('flag');
            flagDiv.innerHTML = `<img src="${flagImgUrl}" alt="علم ${country}">`;
        })
        .catch(error => {
            console.error('Error fetching flag:', error);
            alert('لم يتم العثور على علم الدولة. تأكد من أن اسم الدولة بالإنجليزية أو العربية المدعومة.');
        });
}

// استخدام الموقع الجغرافي للمستخدم
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // جلب أوقات الصلاة بناءً على الموقع الجغرافي
                getPrayerTimesByCoordinates(latitude, longitude);
            },
            () => {
                alert('يرجى تمكين الموقع الجغرافي في متصفحك.');
            }
        );
    } else {
        alert('المتصفح لا يدعم تحديد الموقع الجغرافي.');
    }
}