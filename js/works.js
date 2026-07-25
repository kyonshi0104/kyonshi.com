document.addEventListener("DOMContentLoaded", () => {
    const worksContainer = document.querySelector('.works-items');
    const descriptionContainer = document.querySelector('.works-description');
    const tabButtons = document.querySelectorAll('.works-tab');
    const tabIndicator = document.querySelector('.tab-indicator')

    let allActivities = [];

async function fetchWorks() {
        try {
            const response = await fetch('https://api.kyonshi.com/works');
            if (!response.ok) throw new Error('ネットワークエラーが発生しました');

            allActivities = await response.json();

            const defaultTab = document.querySelector('.works-tab[data-platform="modrinth"]');
            moveIndicator(defaultTab);
            filterWorks('modrinth');
        } catch (error) {
            console.error('データの取得に失敗しました:', error);
            worksContainer.innerHTML = '<p>コンテンツの読み込みに失敗しました。</p>';
        }
    }


    function updateDescription(activity) {
        let desc = activity.description || "";
        if (desc.endsWith("続きをみる")) {
            desc = desc.slice(0, -5).trim();
        }

        descriptionContainer.innerHTML = `
            <h2>${activity.title}</h2>
            <p>${desc}</p>
        `;
    }

    function renderWorks(activities) {
        worksContainer.innerHTML = '';
        if (activities.length > 0) {
            updateDescription(activities[0]);
        } else {
            descriptionContainer.innerHTML = '<p>表示するコンテンツがありません。</p>';
        }

        activities.forEach(activity => {
            const dateObj = new Date(activity.date);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;

            const itemA = document.createElement('a');
            itemA.className = 'works-item';
            itemA.href = activity.url;
            itemA.target = '_blank';

            const imageurl = activity.imageUrl ?? "/res/imgs/github_background.png";
            const platformName = activity.platform.charAt(0).toUpperCase() + activity.platform.slice(1);

            itemA.innerHTML = `
                <p class="works-date">${formattedDate}</p>
                <h2>${activity.title}</h2>
                <p class="works-platform">${platformName}</p>
                <span class="logo logo-${activity.platform}"></span>
                <img class="works-image" src="${imageurl}">
            `;

            itemA.addEventListener('mouseenter', () => {
                updateDescription(activity);
            });

            worksContainer.appendChild(itemA);
        });
    }

function moveIndicator(button) {
        const width = button.offsetWidth;
        const left = button.offsetLeft;
        tabIndicator.style.width = `${width}px`;
        tabIndicator.style.transform = `translateX(${left}px)`;
    }

    function filterWorks(platform) {
        worksContainer.classList.add('fade-out');

        setTimeout(() => {
            const filtered = allActivities.filter(activity => activity.platform === platform);
            renderWorks(filtered);

            worksContainer.classList.remove('fade-out');
        }, 300);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            const clickedBtn = e.target;
            clickedBtn.classList.add('active');

            moveIndicator(clickedBtn);

            const platform = clickedBtn.dataset.platform;
            filterWorks(platform);
        });
    });

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.works-tab.active');
        if (activeTab) moveIndicator(activeTab);
    });

    fetchWorks();
});