document.addEventListener('DOMContentLoaded', function () {

    // === 1. NAVIGASI MOBILE ===
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // === 2. ACTIVE SCROLL LINK ===
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // === 3. TAB LOGIC (BARU & ELEGAN) ===
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            // Reset style semua tab
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-gradient-to-r', 'from-amber-500', 'to-amber-600', 'text-white', 'shadow-md');
                t.classList.add('text-slate-500', 'hover:text-sky-700');
            });
            
            // Set style aktif untuk tab yang diklik
            tab.classList.remove('text-slate-500', 'hover:text-sky-700');
            tab.classList.add('active', 'bg-gradient-to-r', 'from-amber-500', 'to-amber-600', 'text-white', 'shadow-md');
            
            // Tampilkan konten yang sesuai
            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // === 4. CHART JS (Jenjang Karir) ===
    const ctx = document.getElementById('levelBonusChart');
    if (ctx) {
        const levelData = {
            labels: ['LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'LV6', 'LV7', 'LV8', 'LV9'],
            bonus: [50, 100, 200, 400, 600, 1000, 2000, 3000, 5000],
            teamSize: [5, 31, 101, 201, 351, 501, 901, 1601, 3501],
            dividend: [0.3, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 5]
        };

        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: levelData.labels,
                datasets: [{
                    label: 'Bonus (USDT)',
                    data: levelData.bonus,
                    backgroundColor: 'rgba(3, 105, 161, 0.8)',
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });

        // === 5. KALKULATOR LEVEL (Updated) ===
        const calculateLevelBtn = document.getElementById('calculateLevelBtn');
        const teamSizeInput = document.getElementById('teamSizeInput');
        const levelResultDiv = document.getElementById('levelResult');
        const resultContainer = document.getElementById('levelResultContainer');

        if(calculateLevelBtn) {
            calculateLevelBtn.addEventListener('click', () => {
                const size = parseInt(teamSizeInput.value);
                if (resultContainer) resultContainer.classList.remove('hidden');

                if (isNaN(size) || size <= 0) {
                    levelResultDiv.innerHTML = `<span class="text-red-300">Masukkan angka valid.</span>`;
                    return;
                }

                let currentLevel = 'Belum Mencapai Level';
                let currentBonus = 0;
                let currentDividend = 0;
                let nextLevelSize = levelData.teamSize[0];

                for (let i = levelData.teamSize.length - 1; i >= 0; i--) {
                    if (size >= levelData.teamSize[i]) {
                        currentLevel = levelData.labels[i];
                        currentBonus = levelData.bonus[i];
                        currentDividend = levelData.dividend[i];
                        nextLevelSize = (i + 1 < levelData.teamSize.length) ? levelData.teamSize[i+1] : null;
                        break;
                    }
                }

                // Output Hasil Styling Baru
                let resultHTML = `<div class="text-white">Dengan <strong>${size}</strong> anggota:</div>`;
                if (currentLevel !== 'Belum Mencapai Level') {
                    resultHTML += `
                        <ul class="mt-2 space-y-1 text-sky-100 text-sm">
                            <li class="flex justify-between border-b border-sky-700 pb-1"><span>Level:</span> <span class="font-bold text-amber-400 text-lg">${currentLevel}</span></li>
                            <li class="flex justify-between"><span>Bonus:</span> <span class="font-bold text-amber-400">${currentBonus} USDT</span></li>
                            <li class="flex justify-between"><span>Dividen:</span> <span class="font-bold text-amber-400">${currentDividend}%</span></li>
                        </ul>
                    `;
                } else {
                    resultHTML += `<span class="font-bold text-amber-400">Belum LV1.</span> <span class="text-xs text-sky-300">Kurang ${nextLevelSize - size} lagi.</span>`;
                }
                levelResultDiv.innerHTML = resultHTML;
            });
        }
    }

    // === 6. KALKULATOR PROFIT HARIAN ===
    const calculateProfitBtn = document.getElementById('calculateProfitBtn');
    if (calculateProfitBtn) {
        calculateProfitBtn.addEventListener('click', () => {
            const P = parseFloat(document.getElementById('initialCapital').value);
            const days = parseInt(document.getElementById('targetProfit').value);
            const r = 0.0085; // 0.85%
            const USD_IDR = 16649; // Estimasi

            if (isNaN(P) || P < 100) { alert("Min modal 100 USDT"); return; }
            
            // Generate Tabel
            const tableBody = document.getElementById('dailyTableBody');
            tableBody.innerHTML = '';
            let currentBal = P;
            
            for(let i=1; i<=days; i++){
                let profit1 = currentBal * r;
                let midBal = currentBal + profit1;
                let profit2 = midBal * r;
                let endBal = midBal + profit2;
                
                // Tambahkan baris ke tabel (Simplified)
                const row = `<tr><td class="px-4 py-2">${i}</td><td class="px-4 py-2 text-green-600">+${(profit1+profit2).toFixed(2)}</td><td class="px-4 py-2 font-bold">${endBal.toFixed(2)}</td></tr>`;
                tableBody.innerHTML += row;
                currentBal = endBal;
            }

            document.getElementById('bepDays').textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentBal);
            document.getElementById('bepDays-idr').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(currentBal * USD_IDR);
            
            document.getElementById('profitResult').classList.remove('hidden');
            document.getElementById('dailyBreakdown').classList.remove('hidden');
        });
    }

    // === 7. LOGIKA AUDIO PLAYER ===
    let currentAudio = null;
    document.querySelectorAll('.audio-player-btn').forEach(button => {
        button.addEventListener('click', () => {
            const src = button.dataset.audioSrc;
            const playIcon = button.querySelector('.play-icon');
            const pauseIcon = button.querySelector('.pause-icon');

            if (currentAudio && currentAudio.src.includes(src)) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                } else {
                    currentAudio.pause();
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            } else {
                if (currentAudio) currentAudio.pause();
                // Reset icon lama jika ada
                document.querySelectorAll('.pause-icon').forEach(i => i.style.display = 'none');
                document.querySelectorAll('.play-icon').forEach(i => i.style.display = 'block');

                currentAudio = new Audio(src);
                currentAudio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';

                currentAudio.addEventListener('ended', () => {
                     playIcon.style.display = 'block';
                     pauseIcon.style.display = 'none';
                });
            }
        });
    });

    // === 8. MODAL IMAGE (LIGHTBOX) ===
    const imgModal = document.getElementById('image-modal');
    if(imgModal) {
        document.querySelectorAll('.cert-item').forEach(item => {
            item.addEventListener('click', () => {
                const src = item.querySelector('img').src;
                document.getElementById('modal-img').src = src;
                imgModal.classList.remove('hidden');
            });
        });
        document.getElementById('close-image-modal').addEventListener('click', () => {
            imgModal.classList.add('hidden');
        });
    }
    
    // === 9. MODAL UMUM (Contact, dll) ===
    const contactModal = document.getElementById('contact-modal');
    const openBtns = document.querySelectorAll('#open-modal-btn-header, #open-modal-btn-mobile, #open-modal-btn-hero');
    const closeBtn = document.getElementById('close-modal-btn');
    
    openBtns.forEach(btn => btn?.addEventListener('click', () => contactModal.classList.remove('hidden')));
    closeBtn?.addEventListener('click', () => contactModal.classList.add('hidden'));

});
