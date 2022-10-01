const PLAYER_STORAGE_KEY = 'Trần Việt Hoàn'

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: 'Phút ban đầu',
            singer: 'Vũ',
            path: '/asset/music/song1.mp3',
            image: '/asset/img/img1.jpg'
        },
        {
            name: 'Mơ',
            singer: 'Vũ Cát Tường',
            path: '/asset/music/song2.mp3',
            image: '/asset/img/img2.jpg'
        },
        {
            name: 'Em ơi',
            singer: 'Vũ Cát Tường',
            path: '/asset/music/song3.mp3',
            image: '/asset/img/img3.jpg'
        },
        {
            name: 'Vườn mây',
            singer: 'Madihu - Mạc Mai Sương',
            path: '/asset/music/song4.mp3',
            image: '/asset/img/img4.jpg'
        },
        {
            name: 'Chuyện đôi ta',
            singer: 'Emceee L(Da LAB) - Muộii',
            path: '/asset/music/song5.mp3',
            image: '/asset/img/img5.jpg'
        },
        {
            name: 'Người ta nói',
            singer: 'Minh Mon',
            path: '/asset/music/song6.mp3',
            image: '/asset/img/img6.jpg'
        },
        {
            name: 'Gửi anh xa nhớ',
            singer: 'Bích Phương',
            path: '/asset/music/song7.mp3',
            image: '/asset/img/img7.jpg'
        },
        {
            name: 'Tháng mấy em nhớ anh',
            singer: 'Hà Anh Tuấn',
            path: '/asset/music/song8.mp3',
            image: '/asset/img/img8.jpg'
        },
        {
            name: 'Người tình mùa đông',
            singer: 'Hà Anh Tuấn',
            path: '/asset/music/song9.mp3',
            image: '/asset/img/img9.jpg'
        },
        {
            name: 'Chờ anh nhé',
            singer: 'Hoàng Dũng - Hoàng Rob',
            path: '/asset/music/song10.mp3',
            image: '/asset/img/img10.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex? 'active': '' }" data-index = ${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            },

        })
    },

    handleEvent: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý khi CD quay
        const cdThmbRotate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, // Quay trong bao laau
            iterations: Infinity
        })
        cdThmbRotate.pause();

        // Làm Scroll 
        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        
        // Play music
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        // Khi song play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThmbRotate.play();
        }

        // Khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThmbRotate.pause();
        }

        // Khi tiến độ được update
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.round((audio.currentTime / audio.duration) *100);
                progress.value = progressPercent;
            }
        } 

        // Xử lý khi tua
        progress.oninput = function(e) {
            const seekTime = (audio.duration / 100 * e.target.value);
            audio.currentTime = seekTime;
        }

        // Khi on/ off random
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom);
        }

        // Xử lý next khi bài hát kết thúc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{
                nextBtn.click();
            }
        }

        // Xử lý lặp lại bài hát
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }

        // Lắng nghe hành vi click vào song
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')          
            if(songNode || !e.target.closest('.option')) {
            // Xử lý khi click vào bài hát
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },

    scrollToActiveSong: function() {
       setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth", block: "end", inline: "end"
            })
        }, 200)     
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    loadCurrentSong: function () {
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image}`;
        audio.src = this.currentSong.path;

    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính cho obj
        this.defineProperties()
        // Lắng nghe/ xử lí các sự kiện DOM events
        this.handleEvent();
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render()
        // Hiển thị trạng thái ban đầu của btn random và btn repeat 
        btnRandom.classList.toggle('active', this.isRandom);
        btnRepeat.classList.toggle('active', this.isRepeat);
    }
}


app.start();