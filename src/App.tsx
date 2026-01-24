import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Battery,
  BookHeart,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clapperboard,
  CloudRain,
  Coffee,
  Crown,
  Eye,
  Film,
  Gem,
  Gift,
  Grid,
  Hash,
  Heart,
  HelpCircle,
  Info,
  ThumbsUp as LikeIcon,
  Lock,
  LogOut,
  MapPin,
  Megaphone,
  MessageCircle,
  MessageSquareCode,
  MessageSquareText,
  Mic,
  Minus,
  MonitorPlay,
  MoreHorizontal,
  PlayCircle,
  Quote,
  Radio,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Smile,
  Sparkle,
  Sparkles,
  Star,
  Sticker,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  Wind,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// --- 1. 类型定义 ---

interface CharacterStats {
  heartbeat: number; 
  jealousy: number;  
  syncRate: number;  
  mood: string;      
  trait: string;     
  cpRate: number;    
}

interface CharacterProfile {
  surface: string;
  inner: string;
  hobbies: string[];
}

interface DiaryEntry {
  id: string;
  charId: string;
  title: string;
  date: string;
  content: string;
  isUnlocked: boolean;
  unlockCondition: string;
}

interface DateScenario {
  id: string;
  charId: string;
  title: string;
  location: string;
  desc: string;
  story: string;
  img: string;
  cgTitle: string;
}

interface EndingScenario {
    id: string;
    charId: string;
    title: string;
    keyword: string;
    story: string;
    img: string;
    icon: LucideIcon; 
    type: 'True End' | 'Normal End' | 'Bad End'; 
    buff: string; 
    requiredHeartbeat: number;
}

interface Character {
  id: string;
  name: string;
  age: number;
  job: string;
  avatarColor: string;
  avatarImage: string; 
  stats: CharacterStats; 
  impression: string;
  tags: string[];
  profile: CharacterProfile;
}

interface ChatMessage {
  id: string;
  senderId: string; 
  text: string;
  type: 'text' | 'image' | 'voice';
  time: string;
}

interface ChatContact {
  id: string;
  charId: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

interface WeiboPost {
    id: string;
    userName: string;
    userAvatar?: string;
    userTag?: string; 
    isVip: boolean;
    time: string;
    device: string;
    content: string;
    likes: number;
    comments: number;
    reposts: number;
    tags?: string[];
    isHot?: boolean;
    images?: string[]; 
}

interface CPItem {
  id: number;
  name: string;
  members: string[];
  hot: number;
  desc: string;
  trend: 'up' | 'down' | 'stable';
  tags: string[]; 
  observerComment: string;
  fanComments: string[];
  relatedCharId: string;
  superTopic: {
      title: string;
      level: string; 
      readCount: string;
      postCount: string;
      posts: WeiboPost[];
  }
}

interface HotSearchItem {
  id: number;
  rank: number;
  topic: string;
  tag?: '爆' | '热' | '新' | '沸';
  readCount: string; 
  discussCount: string; 
  comments: string[];
  detailedPosts?: WeiboPost[]; 
}

interface Dialogue {
    speaker: string; // 说话者名字，'narrator' 表示旁白
    text: string;
    characterId?: string; // 如果有角色，显示立绘
    emotion?: 'normal' | 'happy' | 'sad' | 'surprised' | 'angry';
}

interface StoryOption {
    id: string;
    label: string;
    target: string;
    desc: string;
    intro: string; 
    story_result: string;
    avatar: string;
    cg_title: string;
    buff?: string;
    dialogues?: Dialogue[]; // 对话序列
}

interface StoryScenario {
    id: string;
    phase: string;
    episodeTitle: string;
    slogan: string;
    rarity: 'SSR' | 'SR' | 'R';
    weather: string;
    location: string;
    task: string;
    directorMission: string;
    text: string;
    options: StoryOption[];
    coverImage: string;
}

interface ProtagonistStat {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
    bg: string;
}

interface CalendarEvent {
    date: number;
    title: string;
    type: 'story' | 'date' | 'special';
    img: string;
    isUnlocked: boolean;
    desc: string;
}

interface ObserverPost {
    id: string;
    author: string;
    role: string;
    title: string;
    content: string;
    time: string;
    replies: number;
}

interface FanDiscussion {
    id: string;
    username: string;
    content: string;
    likes: number;
    avatarColor: string;
    tag?: string;
}

interface EpisodeSocialData {
    hotSearches: HotSearchItem[];
    cpRanking: CPItem[];
    observerDiscussion: ObserverPost[];
    fanDiscussions?: FanDiscussion[]; 
}

interface PostEpisodeMessage {
    charId: string;
    text: string;
}

// --- 2. 模拟数据 ---

const PROTAGONIST = {
  name: "苏若",
  age: 24,
  job: "插画师 / 观察员",
  level: "人气嘉宾",
  publicReputation: 85, 
  currency: 520, 
  collectedCGs: 12, 
  mood: "桃花期", 
  constellation: "天秤座", 
  mbti: "INFP", 
  daysInHouse: 1, 
  signature: "🎨 用色彩记录心动，尋找那個懂我畫中意的人。", 
  personalTags: ["貓系女友", "充滿靈氣", "甜點十級", "社恐但話嘮"], 
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  stats: [
    { label: "魅力", value: 95, icon: Star, color: "text-pink-500", bg: "bg-pink-100" },
    { label: "亲和", value: 90, icon: Smile, color: "text-orange-400", bg: "bg-orange-100" },
    { label: "灵感", value: 115, icon: Zap, color: "text-purple-500", bg: "bg-purple-100" },
  ] as ProtagonistStat[]
};

const CHARACTERS: Character[] = [
  { 
    id: 'lu', name: '陆星辞', age: 25, job: '金融分析师', 
    avatarColor: 'bg-blue-100', 
    avatarImage: '/images/luxingci.png', 
    stats: { heartbeat: 10, jealousy: 0, syncRate: 15, mood: "觀察", trait: "深情·光", cpRate: 50 },
    impression: "气质独特。", 
    tags: ["精英", "反差萌", "深情"],
    profile: {
        surface: "温润如玉的学霸，举止绅士，语气温和但逻辑严密。",
        inner: "极强的胜负欲和掌控欲。習慣將一切私有化。",
        hobbies: ["阅读经济学", "网球", "收藏钢笔"]
    }
  },
  { 
    id: 'shen', name: '沈予', age: 29, job: '建筑设计师', 
    avatarColor: 'bg-slate-200', 
    avatarImage: 'https://images.unsplash.com/photo-1614726365723-49cfae927846?q=80&w=400&auto=format&fit=crop', 
    stats: { heartbeat: 15, jealousy: 0, syncRate: 20, mood: "平淡", trait: "稳重·冰", cpRate: 45 },
    impression: "安靜的女生。", 
    tags: ["禁欲系", "导师", "成熟"],
    profile: {
        surface: "清冷疏离的高岭之花，带着金丝眼镜，对生活品质要求极高。",
        inner: "内心细腻且孤独，像一座谢绝参观的精密建筑。",
        hobbies: ["手冲咖啡", "速写", "光影艺术展"]
    }
  },
  { 
    id: 'jiang', name: '江哲', age: 23, job: '特警队长', 
    avatarColor: 'bg-orange-100', 
    avatarImage: 'https://images.unsplash.com/photo-1620646233562-f2a31adcc44a?q=80&w=400&auto=format&fit=crop', 
    stats: { heartbeat: 20, jealousy: 0, syncRate: 10, mood: "好奇", trait: "热烈·火", cpRate: 60 },
    impression: "姐姐好漂亮！", 
    tags: ["小狼狗", "直球", "热烈"],
    profile: {
        surface: "阳光开朗的大男孩，笑容极具感染力，直率坦诚。",
        inner: "有着超越年龄的责任感和保护欲。感情中的行动派。",
        hobbies: ["极限运动", "体能训练", "吉他弹唱"]
    }
  },
];

const SCENARIOS: StoryScenario[] = [
    {
        id: 'ep1', phase: '第1期', episodeTitle: '初见信号', slogan: "若有似無的試探 · 宿命開場", rarity: "R",
        coverImage: "/images/episode1.png",
        weather: '微風 25℃', location: '心动别墅 (大门)', task: '入住与初识',
        directorMission: "完成入住，並在晚餐環節獲得至少一位男嘉賓的關注。", 
        text: `初夏的風捲著梔子花香，你拖著略顯沉重的行李箱停在別墅前。心跳莫名漏了一拍，彷彿預感到了門後等待著怎樣的際遇。\n\n推開大門的瞬間，客廳裡的三道視線同時聚焦過來。空氣在那一秒變得黏稠而曖昧。\n行李箱輪子卡在了門檻上，誰會是那個打破沉默走向你的人？`,
        options: [
            { id: 'opt-lu-ep1', label: '回應陸星辭的注視', target: '陆星辞', desc: '他的目光像一張精密編織的網，禮貌卻帶著不容忽視的侵略性。', intro: "陸星辭合上手中的財經雜誌，起身的動作行雲流水。他沒有立刻說話，而是用行動接管了你的困窘。", story_result: "“給我吧。”\n\n他的聲音低沈悅耳，像是大提琴的琴弦震動。手指接過拉桿時，無意間擦過你的手背，指腹乾燥而溫熱。\n那一瞬間的觸碰彷彿帶了電，他微微垂眸，鏡片後的眼神深邃得讓人看不懂：“初次見面，我是陸星辭。”", avatar: '/images/行李.png', cg_title: "指尖電流 · 紳士陷阱" },
            { id: 'opt-shen-ep1', label: '對沈予點頭致意', target: '沈予', desc: '他站在光影交界處，金絲眼鏡折射出一絲冷冽，卻又莫名吸引人。', intro: "沈予推了推眼鏡，視線在你身上停留了三秒，彷彿在審視一件即將放入展館的藝術品。", story_result: "他沒有直接觸碰你的行李，而是先一步幫你推開了沈重的玄關大門。\n\n“小心台階。”\n\n聲音清冷，卻在轉身時為你擋住了刺眼的陽光。空氣中飄來淡淡的雪松香氣，那是屬於沈予的疏離與溫柔。", avatar: CHARACTERS[1].avatarImage, cg_title: "雪松香氣 · 克制關懷" },
            { id: 'opt-jiang-ep1', label: '接住江哲的笑容', target: '江哲', desc: '他像一顆不受控的小太陽，眼裡的熱烈幾乎要將空氣點燃。', intro: "“姐姐！”還沒等你反應過來，一道充滿活力的身影已經衝到了面前，帶起一陣清爽的運動香。", story_result: "江哲一把拎起你沈重的箱子，輕鬆得像是在拿玩具。\n\n“終於等到你了！我還以為今天要一直對著這兩個悶葫蘆呢！”\n他笑得露出兩顆虎牙，湊得很近，你甚至能感覺到他身上散發出的蓬勃熱氣：“我是江哲，以後體力活都歸我，你只管漂亮就好！”", avatar: CHARACTERS[2].avatarImage, cg_title: "直球狙擊 · 少年熱忱" },
        ]
    },
    {
        id: 'ep2', phase: '第2期', episodeTitle: '职业盲盒', slogan: "反轉魅力 · 身份揭曉", rarity: "R",
        coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop",
        weather: '晚风 22℃', location: '別墅客廳', task: '猜測職業與年齡',
        directorMission: "根據線索準確猜測出嘉賓的職業，並獲得關鍵好感度。", 
        text: `晚餐後的客廳燈光被調暗，每個人手裡都捏著一張關於自己的線索卡。\n這是戀綜最經典的環節，也是重新定義彼此關係的轉折點。\n\n當身份的迷霧散去，你會對誰產生新的心動信號？`,
        options: [
            { id: 'opt-lu-ep2', label: '猜测陆星辞 (关键词：K线)', target: '陆星辞', desc: '他漫不經心地轉動著手中的鋼筆，氣場卻掌控全場。', intro: "“K線？”你試探著問道，目光落在他解開一顆釦子的領口，“你是做金融的？”", story_result: "“全對。”陸星辭挑了挑眉，眼底閃過一絲讚賞。\n\n“投行合夥人。不過...”他身體微微前傾，目光鎖定你，“在談判桌上我習慣評估風險，但在你這裡，我願意承擔所有不確定性。”\n精英的承諾，往往比情話更致命。", avatar: CHARACTERS[0].avatarImage, cg_title: "精英承諾 · 風險評估" },
            { id: 'opt-shen-ep2', label: '猜测沈予 (关键词：凝固)', target: '沈予', desc: '他展示了一張線條繁複的手繪圖，指尖修長乾淨。', intro: "“凝固的音樂...是建築師嗎？”你輕聲問道。沈予摘下眼鏡，露出那雙好看的瑞鳳眼。", story_result: "“是建築設計師。”他用紙巾慢條斯理地擦拭鏡片，動作優雅得像電影慢鏡頭。\n\n“我習慣為空間構建秩序。但最近...”他抬眼看你，嘴角勾起極淡的弧度，“我發現有些心動，是無法用圖紙規劃的違章建築。”", avatar: CHARACTERS[1].avatarImage, cg_title: "違章心動 · 秩序崩塌" },
            { id: 'opt-jiang-ep2', label: '猜测江哲 (关键词：守护)', target: '江哲', desc: '他拿出了一枚磨損的警徽，神情從嬉皮笑臉瞬間變得堅毅。', intro: "“守護...是警察嗎？”你驚訝地問。江哲不好意思地撓撓頭，耳根微紅。", story_result: "“特警隊長！”他挺直了背脊，眼裡有光，“平時訓練很苦，但我這肩膀靠得住！”\n\n他拍了拍自己的肩膀，眼神卻變得有些軟糯：“保護人民是責任，但如果可以...我想申請一份保護姐姐的專屬任務，期限是一輩子。”", avatar: CHARACTERS[2].avatarImage, cg_title: "專屬任務 · 安全感" },
        ]
    },
    {
        id: 'ep3', phase: '第3期', episodeTitle: '怦然心动夜', slogan: "雨夜禁區 · 荷爾蒙失控", rarity: "SSR",
        coverImage: "https://images.unsplash.com/photo-1515595914102-7c60317e3763?q=80&w=2070&auto=format&fit=crop",
        weather: '雷雨 24℃', location: '心动别墅 (暴雨中)', task: '雨夜的秘密独处',
        directorMission: "在暴雨夜做出你的心動抉擇，觸發專屬隱藏劇情。", 
        text: `一場突如其來的暴雨切斷了別墅的信號，也隔絕了攝影機的窺探。\n窗外雷聲轟鳴，室內卻安靜得能聽見彼此的呼吸聲。\n\n這是規則之外的「禁區時間」。\n手機在黑暗中震動了三下，三個不同的定位，導向三個危險又迷人的夜晚。\n今晚，你想躲進誰的傘下？`,
        options: [
            { id: 'opt-lu-ep3', label: '前往市图书馆 (陆星辞)', target: '陆星辞', desc: '定位在圖書館珍本區。那裡光線昏暗，只有書香和他身上的冷冽氣息。', intro: "圖書館的角落裡，陸星辭正背對著你整理書架。白襯衫被雨水打濕，隱約透出肌肉線條。", story_result: "你剛走近，就被他一把拉進了書架深處的死角。\n\n“噓...”他的手指抵在你的唇上，呼吸滾燙。\n他單手撐在你耳側，將你困在書架與胸膛之間，摘下眼鏡，眼神不再克制：“這裡沒有攝像頭...蘇若，我可以不做那個克制的陸星辭了嗎？”", avatar: CHARACTERS[0].avatarImage, cg_title: "書架咚 · 禁慾崩壞" },
            { id: 'opt-shen-ep3', label: '前往私人工作室 (沈予)', target: '沈予', desc: '那是他從未對外公開的領地。今晚，他想讓你做唯一的訪客。', intro: "工作室的門虛掩著，透出暖黃的燈光。沈予正專注地凝視著一張設計圖，眉頭微蹙。", story_result: "“你來了。”沈予放下筆，聲音沙啞。\n\n他帶你走到巨大的落地窗前，看著窗外的雨幕。“建築講究平衡與支撐，但我最近發現...”他轉身，指尖輕輕拂過你的髮絲，“你在我心裡的比重，已經讓我的世界失衡了。你願意...做我的支點嗎？”", avatar: CHARACTERS[1].avatarImage, cg_title: "靈魂支點 · 私密領地" },
            { id: 'opt-jiang-ep3', label: '前往体育馆 (江哲)', target: '江哲', desc: '空無一人的體育館，只有籃球撞擊地面的迴響和少年毫不掩飾的愛意。', intro: "江哲獨自一人在練習投籃，汗水順著下頜線滴落，濕透的球衣貼在身上，荷爾蒙爆棚。", story_result: "看到你來，他像只被淋濕的大金毛一樣撲過來，卻在最後一刻停住，怕身上的汗水弄髒你。\n\n“外面打雷好吵，我有點怕。”他撒謊都不打草稿，那雙亮晶晶的眼睛裡寫滿了渴望，“姐姐能不能...抱我一下？就一下，充電就好！”", avatar: CHARACTERS[2].avatarImage, cg_title: "濕身擁抱 · 撒嬌充電" },
        ]
    },
    {
        id: 'ep4', phase: '第4期', episodeTitle: '心動廚房', slogan: "味蕾與心跳的雙重奏", rarity: "SR",
        coverImage: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop",
        weather: '晴 26℃', location: '開放式廚房', task: '雙人晚餐',
        directorMission: "與心動對象共同完成一道料理，提升默契度。",
        text: "廚房裡瀰漫著煙火氣，切菜板的聲音和湯鍋的咕嘟聲交織。誰會是那個與你在三餐四季中尋找共鳴的最佳搭檔？",
        options: [
            { id: 'opt-lu-ep4', label: '陸星辭的紅酒燉牛肉', target: '陆星辞', desc: '他在廚房裡也像是在做實驗，精確而優雅，紅酒的香氣令人沈醉。', intro: "陸星辭挽起袖口，露出線條流暢的小臂。他精準地控制著火候，就像控制股市大盤一樣。", story_result: "你遞給他調料瓶時，指尖相觸。他低聲說：“這道菜需要時間慢慢燉，就像我們之間的關係。”", avatar: CHARACTERS[0].avatarImage, cg_title: "精準投餵" },
            { id: 'opt-shen-ep4', label: '沈予的手沖咖啡', target: '沈予', desc: '午後的陽光和咖啡香氣，是他獨有的溫柔，時間彷彿在他身邊靜止。', intro: "沈予專注地注水，水流在濾紙上畫圈。陽光灑在他側臉，金絲眼鏡邊緣泛著光。", story_result: "他遞給你一杯剛沖好的咖啡：“試試看，這是我為你特調的豆子，帶一點花香和果酸。”", avatar: CHARACTERS[1].avatarImage, cg_title: "午後醇香" },
            { id: 'opt-jiang-ep4', label: '江哲的愛心炒飯', target: '江哲', desc: '雖然賣相一般，甚至有點糊，但充滿了滿滿的少年心意。', intro: "江哲在廚房裡手忙腳亂，差點把鹽當成糖。他看到你來，不好意思地撓撓頭。", story_result: "“雖然賣相不好，但我保證好吃！”他期待地看著你吃下第一口，“怎麼樣怎麼樣？是不是有愛的味道？”", avatar: CHARACTERS[2].avatarImage, cg_title: "笨拙的愛" }
        ]
    },
    {
        id: 'ep5', phase: '第5期', episodeTitle: '真心話大冒險', slogan: "酒精微醺 · 真心顯露", rarity: "SR",
        coverImage: "https://images.unsplash.com/photo-1510925758641-869d353cecc7?q=80&w=2070&auto=format&fit=crop",
        weather: '陰 22℃', location: '別墅露台', task: '團體遊戲',
        directorMission: "在遊戲中探聽他的真實心意，或展現你的獨特魅力。",
        text: "夜色漸深，酒瓶轉動，指向了誰的秘密？真心話還是大冒險，這是一個問題。",
        options: [
            { id: 'opt-lu-ep5', label: '質問陸星辭', target: '陆星辞', desc: '借著酒勁，問出那個一直藏在心裡、不敢問的問題。', intro: "酒瓶指向了陸星辭。你深吸一口氣，決定不再迴避。", story_result: "“你對我是認真的嗎？”你直視他的眼睛。他放下酒杯，眼神深邃：“比我做過的任何一筆投資都認真。”", avatar: CHARACTERS[0].avatarImage, cg_title: "酒後真言" },
            { id: 'opt-shen-ep5', label: '挑戰沈予', target: '沈予', desc: '讓他摘下那層疏離的面具，露出真實的情緒波動。', intro: "“大冒險，對視十秒。”你提出了挑戰。沈予愣了一下，隨即摘下眼鏡。", story_result: "沒有了鏡片的遮擋，他的眼神溫柔得像一汪湖水。第五秒，他先移開了視線，耳尖微紅：“你贏了。”", avatar: CHARACTERS[1].avatarImage, cg_title: "破冰時刻" },
            { id: 'opt-jiang-ep5', label: '逗弄江哲', target: '江哲', desc: '看他臉紅心跳、手足無措的樣子，是一種別樣的樂趣。', intro: "“真心話，你在這裡最喜歡誰？”江哲的臉瞬間爆紅，支支吾吾。", story_result: "“當然是...當然是大家都喜歡啊！”他看了你一眼，小聲補充，“但最喜歡姐姐。”", avatar: CHARACTERS[2].avatarImage, cg_title: "純情反應" }
        ]
    },
    {
        id: 'ep6', phase: '第6期', episodeTitle: '遊樂園之約', slogan: "童話夢境 · 專屬回憶", rarity: "SSR",
        coverImage: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?q=80&w=2070&auto=format&fit=crop",
        weather: '晴 24℃', location: '夢幻遊樂園', task: '戶外約會',
        directorMission: "在摩天輪頂端或旋轉木馬前許下心願，創造難忘回憶。",
        text: "遊樂園是製造心動的聖地。旋轉木馬的燈光和摩天輪的高度，誰會陪你坐到最後？",
        options: [
            { id: 'opt-lu-ep6', label: '陸星辭的煙花秀', target: '陆星辞', desc: '他為你包下了整場煙花表演，只為博你一笑。', intro: "夜幕降臨，城堡上空突然綻放出絢爛的煙花。", story_result: "“喜歡嗎？”他站在你身後，為你擋住人群，“我想讓你知道，在我這裡，你永遠是焦點。”", avatar: CHARACTERS[0].avatarImage, cg_title: "獨家浪漫" },
            { id: 'opt-shen-ep6', label: '沈予的鬼屋探險', target: '沈予', desc: '在恐懼中，緊緊握住他的手，感受他掌心的溫度。', intro: "鬼屋裡陰森恐怖，你下意識地抓住沈予的衣角。他反手握住你的手。", story_result: "“別怕，跟著我。”他的聲音在黑暗中格外安心。走出鬼屋時，他也沒有鬆開手。", avatar: CHARACTERS[1].avatarImage, cg_title: "吊橋效應" },
            { id: 'opt-jiang-ep6', label: '江哲的過山車', target: '江哲', desc: '在極速的尖叫聲中，大聲喊出那句藏在心底的喜歡。', intro: "過山車衝上雲霄，江哲興奮地大喊大叫。風把他的頭髮吹得亂七八糟。", story_result: "“姐姐！我好開心啊！”他在風中大喊，“和你在一起的每一秒都好開心！”", avatar: CHARACTERS[2].avatarImage, cg_title: "極速心動" }
        ]
    },
    {
        id: 'ep7', phase: '第7期', episodeTitle: '海邊露營', slogan: "星空為被 · 海浪為伴", rarity: "SR",
        coverImage: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop",
        weather: '多雲 20℃', location: '海邊沙灘', task: '露營過夜',
        directorMission: "與心動對象共度帳篷時光，分享彼此的過去。",
        text: "遠離城市喧囂，海風微涼。帳篷裡只有一盞昏黃的燈，溫暖如春。",
        options: [
            { id: 'opt-lu-ep7', label: '與陸星辭看日出', target: '陆星辞', desc: '裹著毛毯，並肩等待第一縷陽光灑在海面上。', intro: "凌晨四點，陸星辭叫醒了你。海邊很冷，他把外套披在你身上。", story_result: "太陽升起的那一刻，金光灑滿海面。他轉頭看你，眼裡倒映著朝陽和你：“早安，我的太陽。”", avatar: CHARACTERS[0].avatarImage, cg_title: "晨光熹微" },
            { id: 'opt-shen-ep7', label: '與沈予撿貝殼', target: '沈予', desc: '在沙灘上漫步，尋找那顆獨一無二的珍珠。', intro: "沈予低頭專注地在沙灘上尋找著什麼。海浪拍打著他的褲腳。", story_result: "他撿起一枚白色的貝殼，遞給你：“這像不像我們初見那天，你穿的裙子的顏色？”", avatar: CHARACTERS[1].avatarImage, cg_title: "海之信物" },
            { id: 'opt-jiang-ep7', label: '與江哲篝火晚會', target: '江哲', desc: '在火光中起舞，釋放所有熱情，聽他彈吉他唱歌。', intro: "江哲抱著吉他坐在篝火旁，火光映照著他認真的側臉。", story_result: "他唱了一首情歌，目光一直追隨著你。唱完後，他把吉他一扔，拉起你跳舞：“姐姐，今晚只屬於我們！”", avatar: CHARACTERS[2].avatarImage, cg_title: "熾熱之夜" }
        ]
    },
    {
        id: 'ep8', phase: '第8期', episodeTitle: '告白前夕', slogan: "最後的猶豫 · 堅定的選擇", rarity: "SR",
        coverImage: "https://images.unsplash.com/photo-1516575334481-f85287c2c81d?q=80&w=2070&auto=format&fit=crop",
        weather: '雨 18℃', location: '心動別墅', task: '互訴衷腸',
        directorMission: "確認你的心意，為明天的最終告白做準備。",
        text: "明天就是最終抉擇，空氣中瀰漫著離別與期待。今晚，有些話必須說出口。",
        options: [
            { id: 'opt-lu-ep8', label: '給陸星辭寫信', target: '陆星辞', desc: '紙短情長，用文字寫下你羞於啟齒的心意。', intro: "你坐在書桌前，提筆寫下這段時間的點點滴滴。陸星辭敲響了你的房門。", story_result: "他拿著一封同樣厚實的信：“看來我們想到一起去了。明天，我在終點等你。”", avatar: CHARACTERS[0].avatarImage, cg_title: "紙上情書" },
            { id: 'opt-shen-ep8', label: '給沈予留錄音', target: '沈予', desc: '有些話，只想說給他聽，讓他反覆回味。', intro: "你躲在衣帽間，對著錄音筆輕聲訴說。沈予在門外靜靜聽著。", story_result: "推開門，他眼眶微紅：“蘇若，謝謝你願意走進我的世界。這是我聽過最動聽的聲音。”", avatar: CHARACTERS[1].avatarImage, cg_title: "語音留言" },
            { id: 'opt-jiang-ep8', label: '給江哲送禮物', target: '江哲', desc: '一份親手挑選的小禮物，代表你對他的在意。', intro: "你把禮物盒遞給江哲。他驚喜得像個孩子，手都在抖。", story_result: "“這是給我的嗎？真的嗎？”他緊緊抱著禮物，“我也有禮物給你，但我把我自己打包送給你行不行？”", avatar: CHARACTERS[2].avatarImage, cg_title: "專屬驚喜" }
        ]
    },
    {
        id: 'ep9', phase: '第9期', episodeTitle: '最后心动日', slogan: "終極約會 · 靈魂私奔", rarity: "SSR",
        coverImage: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2070&auto=format&fit=crop",
        weather: '晴 25℃', location: '三个神秘地点', task: '最终抉择前的约会',
        directorMission: "確認你的最終心動對象，並完成最後的告白。", 
        text: `今天是做出最終決定前的最後一次約會機會。\n沒有干擾，沒有任務，只有完全屬於兩個人的24小時。\n\n節目組遞給你三張風格迥異的邀請函，那是他們為你準備的「未來預演」。\n你的心，會帶你去向哪裡？`,
        options: [
            { id: 'opt-lu-ep9', label: '私人游艇出海 (陆星辞)', target: '陆星辞', desc: '黑金卡片上只寫了一個碼頭坐標。那是遠離塵囂的海上孤島。', intro: "私人遊艇停靠在碼頭，陸星辭站在甲板上向你伸出手。海風吹起他的衣角，他背後是無盡的藍。", story_result: "遊艇駛向大海深處。他從口袋裡拿出一份規劃書——竟然是他為你規劃的未來十年。\n\n“我不想只爭朝夕，蘇若。”\n海風中，他的聲音堅定而深情，“我想預定你的未來。這份合約的期限是永久，違約金是我的全部身家。你...敢簽嗎？”", avatar: CHARACTERS[0].avatarImage, cg_title: "孤島獨處 · 餘生合約" },
            { id: 'opt-shen-ep9', label: '沉浸式光影展 (沈予)', target: '沈予', desc: '一張手繪的門票，通往一座即將閉館的美術館。那是他為你造的夢。', intro: "美術館閉館了，但沈予手裡有鑰匙。他站在光影交錯的展廳中央，等待著帶你走進他的藝術世界。", story_result: "展廳中央，無數光點匯聚成你的模樣。\n\n沈予站在光影中央，向你伸出手：“藝術追求永恆，但我只追求你。”\n他牽著你停在一張空白的畫布前，遞給你一支筆：“我的世界曾是一片灰白，直到你出現。蘇若，這剩下的留白，我都交給你來填滿。”", avatar: CHARACTERS[1].avatarImage, cg_title: "光影交錯 · 唯一繆斯" },
            { id: 'opt-jiang-ep9', label: '机车夜奔 (江哲)', target: '江哲', desc: '一個酷炫的粉色頭盔和一個定位。那是少年的野性與自由，只為你停留。', intro: "重型機車的引擎聲轟鳴，江哲拍了拍後座，眼神熾熱得像要把你融化。", story_result: "轟鳴的引擎聲劃破夜空，風在耳邊呼嘯。\n他在山頂停下，摘下頭盔，眼神亮得驚人：“姐姐，我想帶你去世界盡頭！只要你在我身後，我就無所不能！”\n他從身後抱住你，心跳快得像擂鼓：“別選別人，選我吧。我會把全世界最好的都捧到你面前！”", avatar: CHARACTERS[2].avatarImage, cg_title: "亡命天涯 · 極致浪漫" },
        ]
    }
];

const ENDINGS: EndingScenario[] = [
    // 陆星辞结局
    { id: 'end_lu_true', charId: 'lu', title: '星河长明', keyword: '势均力敌', story: '他不再是那个高高在上的投资人，而是你最忠实的合伙人。你们在商场上并肩作战，在生活中相濡以沫。', img: CHARACTERS[0].avatarImage, icon: Crown, type: 'True End', buff: '豪门CP达成', requiredHeartbeat: 80 },
    { id: 'end_lu_norm', charId: 'lu', title: '都市传说', keyword: '相敬如宾', story: '你们是外界眼中的模范情侣，虽然少了些激情，但多了一份稳固的承诺。', img: CHARACTERS[0].avatarImage, icon: Coffee, type: 'Normal End', buff: '平淡是真', requiredHeartbeat: 40 },
    { id: 'end_lu_bad', charId: 'lu', title: '遗憾错过', keyword: '各自安好', story: '两条平行线虽然短暂交汇，但最终还是因为理念不同而渐行渐远。', img: CHARACTERS[0].avatarImage, icon: CloudRain, type: 'Bad End', buff: '遗憾美学', requiredHeartbeat: 0 },
    
    // 沈予结局
    { id: 'end_shen_true', charId: 'shen', title: '凝固永恒', keyword: '灵魂缪斯', story: '你是他建筑里唯一的感性变量。他在世界各地为你建房子，你用画笔填满他的空白。', img: CHARACTERS[1].avatarImage, icon: Sparkle, type: 'True End', buff: '艺术神仙眷侣', requiredHeartbeat: 80 },
    { id: 'end_shen_norm', charId: 'shen', title: '周末恋人', keyword: '舒适距离', story: '保持着适当的距离和神秘感，你们享受着这种若即若离的浪漫。', img: CHARACTERS[1].avatarImage, icon: Coffee, type: 'Normal End', buff: '文艺片结局', requiredHeartbeat: 40 },
    { id: 'end_shen_bad', charId: 'shen', title: '高岭之花', keyword: '难以触碰', story: '由于无法走进他封锁的内心，你们最终止步于欣赏，做回了朋友。', img: CHARACTERS[1].avatarImage, icon: Lock, type: 'Bad End', buff: 'BE美学', requiredHeartbeat: 0 },

    // 江哲结局
    { id: 'end_jiang_true', charId: 'jiang', title: '热烈余生', keyword: '专属守护', story: '小狗终於长成了能为你遮风挡雨的狼犬。他的余生任务只有一个：宠你，爱你，保护你。', img: CHARACTERS[2].avatarImage, icon: Shield, type: 'True End', buff: '姐狗天花板', requiredHeartbeat: 80 },
    { id: 'end_jiang_norm', charId: 'jiang', title: '最佳拍档', keyword: '欢喜冤家', story: '哪怕吵吵闹闹也是一种幸福。你们的生活充满了烟火气和笑声。', img: CHARACTERS[2].avatarImage, icon: Smile, type: 'Normal End', buff: '甜蜜日常', requiredHeartbeat: 40 },
    { id: 'end_jiang_bad', charId: 'jiang', title: '盛夏光年', keyword: '短暂绚烂', story: '那个夏天的确很热烈，但正如烟花易冷，年少的喜欢有时抵不过现实的重量。', img: CHARACTERS[2].avatarImage, icon: Wind, type: 'Bad End', buff: '青春纪念册', requiredHeartbeat: 0 },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
    { date: 1, title: "初遇", type: "story", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200", isUnlocked: true, desc: "搬入小屋的第一天，眼神交汇的瞬间。" },
];

const DIARIES: DiaryEntry[] = [
  { id: 'd1', charId: 'lu', title: '关于失控的那几秒', date: '5月20日 暴雨', content: "【绝密备忘录】\n...", isUnlocked: true, unlockCondition: "已解锁" },
];

const DATES: DateScenario[] = [
  { id: 'date_lu', charId: 'lu', title: '私人影院之夜', location: '顶层公寓', desc: '只有两个人的电影开场...', story: "...", img: 'https://images.unsplash.com/photo-1517604931442-71053e68cc23?q=80&w=300', cgTitle: "十指紧扣 · 毯下秘密" },
];

const INITIAL_CHATS: ChatContact[] = [
  {
    id: 'c1', charId: 'lu', unread: 2, lastMessage: "刚结束视频会议。", lastTime: "22:00",
    messages: [
      { id: 'm1', senderId: 'lu', text: "刚结束视频会议。", type: 'text', time: "22:00" },
    ]
  },
  {
    id: 'c2', charId: 'shen', unread: 0, lastMessage: "书房为你留了灯。", lastTime: "20:30",
    messages: [
      { id: 'm1', senderId: 'shen', text: "书房为你留了灯。", type: 'text', time: "20:30" },
    ]
  },
  {
    id: 'c3', charId: 'jiang', unread: 5, lastMessage: "我有好好吃饭哦！求表扬！🐶", lastTime: "12:31",
    messages: [
      { id: 'm1', senderId: 'jiang', text: "我有好好吃饭哦！求表扬！🐶", type: 'text', time: "12:31" },
    ]
  }
];

const EPISODE_SOCIAL_DATA: Record<string, EpisodeSocialData> = {
    'ep1': {
        hotSearches: [
            { 
                id: 1, rank: 1, topic: "#心动信号5首播#", tag: "爆", readCount: "12.5亿", discussCount: "35万", comments: [], 
                detailedPosts: [
                    { id: 'p1', userName: '嗑CP的小姐姐', userTag: '星苏CP粉', isVip: true, time: '2分钟前', device: 'iPhone 14 Pro', content: '啊啊啊！这季嘉宾颜值绝了！特别是陆星辞和苏若这对，第一眼对视就有化学反应！星苏给我锁死！💕', likes: 5234, comments: 892, reposts: 456, tags: ['星苏', '心动信号'], isHot: true },
                    { id: 'p2', userName: '理智追星人', userTag: '吃瓜群众', isVip: false, time: '5分钟前', device: 'Android', content: '客观评价一下：陆星辞接行李那个动作确实很绅士，但说有多特别也谈不上吧...这届观众是不是嗑太猛了？', likes: 123, comments: 234, reposts: 45 },
                    { id: 'p3', userName: '星苏是真的', userTag: 'CP超话主持人', isVip: true, time: '8分钟前', device: 'iPhone 13', content: '【深度分析】陆星辞看苏若的眼神停留时间明显超过社交安全距离！这绝对是心动的信号！细节党已开始考古！\n\n#星苏# #心动信号5#', likes: 8902, comments: 1234, reposts: 567, tags: ['星苏'], isHot: true },
                    { id: 'p4', userName: '水军001号', userTag: '', isVip: false, time: '10分钟前', device: '微博网页版', content: '这季真的不行，男嘉宾都很普通，女嘉宾更是没亮点。建议去看前几季，那才叫高质量。', likes: 2, comments: 45, reposts: 3 },
                    { id: 'p5', userName: '姐狗天选', userTag: '年下控', isVip: false, time: '12分钟前', device: 'iPhone 12', content: '江哲叫姐姐那一声真的甜死我了！小奶狗谁不爱！年下就是最香的！🐕', likes: 3456, comments: 678, reposts: 234, tags: ['姐狗'], isHot: true },
                    { id: 'p6', userName: '专业水军', userTag: '', isVip: false, time: '15分钟前', device: 'Android', content: '楼上那位，江哲明显就是装出来的，这种热情太假了。真正有深度的是沈予，你们都不懂。', likes: 12, comments: 89, reposts: 5 },
                    { id: 'p7', userName: '嗑学博士', userTag: 'CP研究员', isVip: true, time: '18分钟前', device: 'iPad Pro', content: '【显微镜观察】\n1. 陆星辞扶行李箱时手指有停顿\n2. 苏若耳尖红了\n3. 两人对视3.2秒\n\n结论：这对绝对有戏！已下单民政局！🎎', likes: 12345, comments: 2345, reposts: 890, tags: ['星苏', '细节分析'], isHot: true },
                    { id: 'p8', userName: '理智粉反击', userTag: '真爱粉', isVip: false, time: '20分钟前', device: 'iPhone', content: '某些人是不是有毛病？好好的节目非要踩一捧一，每个嘉宾都很好，为什么要吵架？好好看节目不行吗？', likes: 2345, comments: 456, reposts: 123 }
                ]
            },
            { 
                id: 2, rank: 2, topic: "#苏若颜值#", tag: "沸", readCount: "5.3亿", discussCount: "12万", comments: [], 
                detailedPosts: [
                    { id: 'p21', userName: '颜值协会会长', userTag: '美妆博主', isVip: true, time: '1分钟前', device: 'iPhone 14 Pro Max', content: '苏若这个颜我真的服了！这是什么神仙颜值！素颜都这么能打！女生看了都想谈恋爱！✨', likes: 6789, comments: 1234, reposts: 567, tags: ['颜值', '心动信号'], isHot: true },
                    { id: 'p22', userName: '水军机器人', userTag: '', isVip: false, time: '3分钟前', device: '微博网页版', content: '一般般吧，现在的网红都长这样，没什么特别的。', likes: 3, comments: 234, reposts: 2 },
                    { id: 'p23', userName: '真爱守护', userTag: '苏若粉丝', isVip: false, time: '5分钟前', device: 'Android', content: '某些人眼睛是瞎了吗？苏若这颜值还叫一般？你行你上啊！我们苏苏就是最美！不接受反驳！💖', likes: 4567, comments: 890, reposts: 345 }
                ]
            },
            { 
                id: 3, rank: 3, topic: "#陆星辞绅士手#", tag: "热", readCount: "3.2亿", discussCount: "8万", comments: [], 
                detailedPosts: [
                    { id: 'p31', userName: '细节控', userTag: '星苏CP粉', isVip: true, time: '刚刚', device: 'iPhone', content: '陆星辞那个接行李箱的动作！注意看他的手！完全避开了身体接触，只在必要的地方握住！这就是真正的绅士啊！\n\n细节见人品，这个男人我粉定了！👔', likes: 4567, comments: 890, reposts: 345, tags: ['星苏', '细节'], isHot: true },
                    { id: 'p32', userName: 'CP粉头', userTag: '星苏超话', isVip: true, time: '2分钟前', device: 'iPhone 13', content: '【嗑点分析】\n陆星辞：我来帮你\n苏若：谢谢（害羞）\n\n这就是心动的开始啊家人们！我已经开始写同人文了！📝', likes: 7890, comments: 1456, reposts: 567, tags: ['星苏'], isHot: true },
                    { id: 'p33', userName: '黑粉专业户', userTag: '', isVip: false, time: '5分钟前', device: 'Android', content: '演的吧，故意装绅士博好感，这种套路我见多了。', likes: 15, comments: 234, reposts: 8 },
                    { id: 'p34', userName: '护星大队', userTag: '陆星辞粉丝', isVip: false, time: '6分钟前', device: 'iPhone', content: '楼上那位，你是不是看谁都不顺眼？陆总这种从小接受良好教育的人，绅士是刻在骨子里的，不需要演！', likes: 3456, comments: 678, reposts: 234 }
                ]
            },
            { 
                id: 4, rank: 4, topic: "#江哲叫姐姐#", tag: "新", readCount: "1.5亿", discussCount: "4万", comments: [], 
                detailedPosts: [
                    { id: 'p41', userName: '年下爱好者', userTag: '姐狗CP', isVip: false, time: '3分钟前', device: 'iPhone', content: '江哲那声"姐姐"真的叫到我心里去了！小奶狗撒娇谁顶得住啊！年下就是YYDS！🐕💕', likes: 5678, comments: 1234, reposts: 456, tags: ['姐狗'], isHot: true },
                    { id: 'p42', userName: '姐狗CP粉', userTag: 'CP研究员', isVip: true, time: '5分钟前', device: 'iPad', content: '【嗑CP分析】\n江哲：姐姐！\n苏若：（笑）\n\n啊啊啊这个互动甜死我了！弟弟的直球攻势谁能拒绝！我已经开始嗑了！\n\n#姐狗# #年下最香#', likes: 8901, comments: 1678, reposts: 678, tags: ['姐狗'], isHot: true },
                    { id: 'p43', userName: '理智路人', userTag: '', isVip: false, time: '8分钟前', device: 'Android', content: '江哲这样会不会太主动了？感觉有点刻意，不够自然。', likes: 234, comments: 567, reposts: 45 },
                    { id: 'p44', userName: '护哲小分队', userTag: '江哲粉丝', isVip: false, time: '9分钟前', device: 'iPhone', content: '什么叫刻意？江哲就是这种性格啊！阳光开朗大男孩，对谁都是这样热情！这才是真实的他！你们不懂就不要乱说！', likes: 3456, comments: 789, reposts: 234 }
                ]
            },
            { id: 5, rank: 5, topic: "#心动别墅装修#", tag: "新", readCount: "8000万", discussCount: "1万", comments: [], detailedPosts: [] }
        ],
        cpRanking: [
            { 
                id: 1, name: "星苏", members: ["陆", "苏"], hot: 52000, desc: "初见即宿命", trend: 'up', tags: ["颜霸", "强强"], 
                observerComment: "陆星辞第一眼眼神就不对劲，这绝对是猎人看到了猎物。", 
                fanComments: ["眼神拉丝了家人们！", "给我锁死！", "星苏就是最配的！"], 
                relatedCharId: 'lu', 
                superTopic: { 
                    title: "星苏", level: "LV2", readCount: "1.2亿", postCount: "1.5万", 
                    posts: [
                        { id: 'cp1', userName: '星苏CP粉头', userTag: '超话主持人', isVip: true, time: '5分钟前', device: 'iPhone', content: '【CP分析】星苏第一期的互动真的绝了！陆星辞那个眼神、那个动作，每一个细节都在说：我对你有意思！\n\n#星苏# #心动信号5#', likes: 5678, comments: 1234, reposts: 456, tags: ['星苏'], isHot: true },
                        { id: 'cp2', userName: '嗑CP专业户', userTag: 'CP研究员', isVip: false, time: '8分钟前', device: 'Android', content: '星苏就是这一季的天选CP！从第一次见面就有化学反应！我已经开始写同人文了！', likes: 3456, comments: 789, reposts: 234, tags: ['星苏'] },
                        { id: 'cp3', userName: '水军账号', userTag: '', isVip: false, time: '10分钟前', device: '微博网页版', content: '这对明显不合适，年龄差距、性格差异都太大了。', likes: 3, comments: 567, reposts: 2 },
                        { id: 'cp4', userName: '星苏护卫队', userTag: '真爱粉', isVip: false, time: '11分钟前', device: 'iPhone', content: '什么叫不合适？陆星辞和苏若明明就是最配的！势均力敌的爱情才是最好的！某些人不懂就不要乱说！', likes: 4567, comments: 890, reposts: 345 }
                    ]
                }
            },
            { 
                id: 2, name: "姐狗", members: ["江", "苏"], hot: 48000, desc: "热情小太阳", trend: 'up', tags: ["年下", "直球"], 
                observerComment: "江哲太热情了，这种直球攻势很难招架。", 
                fanComments: ["修勾冲鸭！", "姐姐看看我！", "年下就是最香的！"], 
                relatedCharId: 'jiang', 
                superTopic: { 
                    title: "姐狗", level: "LV1", readCount: "9000万", postCount: "9000", 
                    posts: [
                        { id: 'cp5', userName: '年下爱好者', userTag: '姐狗CP粉', isVip: true, time: '6分钟前', device: 'iPhone', content: '江哲叫姐姐那一声真的甜死我了！小奶狗撒娇谁能拒绝！年下就是YYDS！\n\n#姐狗# #年下最香#', likes: 4567, comments: 890, reposts: 345, tags: ['姐狗'], isHot: true },
                        { id: 'cp6', userName: '姐狗天选', userTag: 'CP粉', isVip: false, time: '9分钟前', device: 'Android', content: '江哲这种直球又可爱的弟弟太香了！真诚的喜欢才是最珍贵的！', likes: 3456, comments: 789, reposts: 234, tags: ['姐狗'] }
                    ]
                }
            },
            { 
                id: 3, name: "予若", members: ["沈", "苏"], hot: 45000, desc: "清冷氛围感", trend: 'stable', tags: ["慢热", "文艺"], 
                observerComment: "沈予比较慢热，但是这种细水长流的感觉也不错。", 
                fanComments: ["都在细节里！", "艺术组上分！", "细水长流最浪漫！"], 
                relatedCharId: 'shen', 
                superTopic: { 
                    title: "予若", level: "LV1", readCount: "8000万", postCount: "8000", 
                    posts: [
                        { id: 'cp7', userName: '艺术组', userTag: '文艺青年', isVip: true, time: '7分钟前', device: 'iPad', content: '予若这对真的很有艺术感！建筑师和插画师的组合，文艺又浪漫！\n\n#予若# #灵魂伴侣#', likes: 3456, comments: 789, reposts: 234, tags: ['予若'] }
                    ]
                }
            }
        ],
        observerDiscussion: [
            { id: 'ob1', author: '楊丞琳', role: '心動偵探', title: '【微表情分析】陸星辭那個眼神！', content: '大家有沒有注意到，蘇若剛進來的時候，陸星辭本來在看雜誌，但他那個眼神停留的時間明顯超過了社交禮儀的安全區！這絕對是有好感！', time: '10分鐘前', replies: 156 },
            { id: 'ob2', author: '姜振宇', role: '心理專家', title: '【心理學】江哲的防禦姿態', content: '雖然江哲看起來很熱情，但他在初次見面時身體其實是微微後傾的，這說明他內心其實有點緊張，是在用熱情掩飾羞澀。', time: '15分鐘前', replies: 89 },
            { id: 'ob3', author: '李雪琴', role: '嗑學家', title: '【吐槽】沈予太端著了吧？', content: '沈老師那個“小心台階”也太官方了哈哈哈哈，但是我怎麼覺得這種高嶺之花一旦下神壇會很猛呢？期待打臉！', time: '20分鐘前', replies: 230 }
        ],
        fanDiscussions: [
            { id: 'f1', username: '吃瓜第一線', content: '陸星辭太會了！！那個接行李的動作我反覆看了十遍！', likes: 1205, avatarColor: 'bg-yellow-400' },
            { id: 'f2', username: '蘇蘇的狗', content: '只有我喜歡江哲嗎？小狗多可愛啊！', likes: 892, avatarColor: 'bg-green-400' },
            { id: 'f3', username: '建築美學', content: '沈予的聲音好好聽，低音炮殺我！', likes: 654, avatarColor: 'bg-blue-400' },
            { id: 'f4', username: '路人甲', content: '這一季女嘉賓顏值好高，希望能有個好結局。', likes: 233, avatarColor: 'bg-gray-400' }
        ]
    },
    'ep2': {
        hotSearches: [
            { id: 1, rank: 1, topic: "#陸星辭 霸總小說照進現實#", tag: "爆", readCount: "15.5亿", discussCount: "48萬", comments: [], detailedPosts: [] },
            { id: 2, rank: 2, topic: "#江哲 特警#", tag: "沸", readCount: "9.8亿", discussCount: "25萬", comments: [], detailedPosts: [] },
            { id: 3, rank: 3, topic: "#沈予 建築師#", tag: "热", readCount: "6.2亿", discussCount: "15萬", comments: [], detailedPosts: [] },
            { id: 4, rank: 4, topic: "#蘇若 插畫師#", tag: "新", readCount: "3.5亿", discussCount: "8萬", comments: [], detailedPosts: [] }
        ],
        cpRanking: [
            { id: 1, name: "星蘇", members: ["陸", "蘇"], hot: 85000, desc: "豪門聯姻既視感", trend: 'up', tags: ["般配", "勢均力敵"], observerComment: "職業公佈後，兩人的氣場更合了。", fanComments: [], relatedCharId: 'lu', superTopic: { title: "星蘇", level: "LV4", readCount: "3億", postCount: "2萬", posts: [] } },
            { id: 2, name: "姐狗", members: ["江", "蘇"], hot: 75000, desc: "守護騎士", trend: 'up', tags: ["反差", "守護"], observerComment: "特警配畫家，這什麼言情設定！", fanComments: [], relatedCharId: 'jiang', superTopic: { title: "姐狗", level: "LV3", readCount: "2.5億", postCount: "1.8萬", posts: [] } },
            { id: 3, name: "予若", members: ["沈", "蘇"], hot: 72000, desc: "靈魂共振", trend: 'up', tags: ["品味", "知音"], observerComment: "都是搞藝術的，共同話題肯定多。", fanComments: [], relatedCharId: 'shen', superTopic: { title: "予若", level: "LV3", readCount: "2億", postCount: "1.5萬", posts: [] } }
        ],
        observerDiscussion: [
            { id: 'ob1', author: '杜海濤', role: '氣氛擔當', title: '【震驚】這一季男嘉賓職業太卷了吧！', content: '金融巨鱷、建築新星、特警隊長...蘇若這要怎麼選啊？我都替她糾結！', time: '5分鐘前', replies: 340 }
        ],
        fanDiscussions: [
            { id: 'f1', username: '顏值協會會長', content: '陸總好帥！我要爬牆了！', likes: 2300, avatarColor: 'bg-red-400' },
            { id: 'f2', username: '今天嗑糖了嗎', content: '沈予看蘇若畫畫的眼神絕了，好寵溺啊！', likes: 1540, avatarColor: 'bg-indigo-400' },
            { id: 'f3', username: '特警小迷妹', content: '江哲弟弟真的好有安全感，想嫁！', likes: 1100, avatarColor: 'bg-orange-400' }
        ]
    },
    'ep3': {
        hotSearches: [
            { 
                id: 1, rank: 1, topic: "#陆星辞 图书馆书架咚#", tag: "爆", readCount: "21.5亿", discussCount: "88万", comments: [], 
                detailedPosts: [
                    { id: 'p301', userName: '星苏CP头子', userTag: '超话主持人', isVip: true, time: '刚刚', device: 'iPhone 14 Pro', content: '【炸裂现场】\n图书馆！书架咚！摘眼镜！\n"我可以不做那个克制的陆星辞了吗？"\n\n我人没了！！！！这是我能看的吗？？？\n\n#星苏# #书架咚#', likes: 23456, comments: 4567, reposts: 2345, tags: ['星苏', '名场面'], isHot: true },
                    { id: 'p302', userName: 'CP嗑学博士', userTag: '细节分析', isVip: true, time: '1分钟前', device: 'iPad Pro', content: '【显微镜分析】\n1. 陆星辞白衬衫湿透，隐约透出肌肉线条\n2. 摘下眼镜那一刻，眼神从克制到危险\n3. "这里没有摄像头" - 暗示了什么？\n4. 手指抵唇的"嘘" - 禁欲感拉满\n\n结论：这是成年人之间的推拉！我宣布这是恋综天花板！🔥', likes: 18902, comments: 3456, reposts: 1234, tags: ['星苏', '细节'], isHot: true },
                    { id: 'p303', userName: '水军反串', userTag: '', isVip: false, time: '3分钟前', device: '微博网页版', content: '太假了，剧本明显，这种情节一看就是安排好的。', likes: 8, comments: 234, reposts: 5 },
                    { id: 'p304', userName: '星苏护卫队', userTag: '真爱粉', isVip: false, time: '4分钟前', device: 'iPhone', content: '某些人是不是酸了？这种自然的化学反应能演出来？陆星辞的眼神、动作、语气，每一个细节都是真实的！不懂就别瞎说！', likes: 8901, comments: 1678, reposts: 678 },
                    { id: 'p305', userName: '嗑到昏迷', userTag: 'CP粉', isVip: false, time: '5分钟前', device: 'Android', content: '我宣布！星苏就是这一季的官配！书架咚这一下直接把我送走了！按头小分队在哪里！给我锁死这对！💑', likes: 14567, comments: 2789, reposts: 1123, tags: ['星苏'], isHot: true },
                    { id: 'p306', userName: '理智粉', userTag: '', isVip: false, time: '7分钟前', device: 'iPhone', content: '虽然很甜，但希望大家理性嗑CP，不要过度解读。给嘉宾一些私人空间。', likes: 3456, comments: 789, reposts: 234 }
                ]
            },
            { 
                id: 2, rank: 2, topic: "#沈予 这里的雨夜#", tag: "沸", readCount: "12.2亿", discussCount: "45万", comments: [], 
                detailedPosts: [
                    { id: 'p307', userName: '予若CP粉', userTag: '文艺青年', isVip: true, time: '2分钟前', device: 'iPhone', content: '沈予的雨夜工作室！那个"你在我心里的比重，已经让我的世界失衡了"！这是什么神仙告白！文艺又深情！\n\n#予若# #灵魂伴侣#', likes: 8901, comments: 1678, reposts: 678, tags: ['予若'], isHot: true },
                    { id: 'p308', userName: '艺术组', userTag: 'CP研究员', isVip: false, time: '4分钟前', device: 'iPad', content: '【深度解读】沈予这段话完美诠释了建筑师和插画师的浪漫！建筑需要平衡与支撑，而你成了他的支点！这是什么绝美设定！', likes: 6789, comments: 1234, reposts: 567, tags: ['予若'] },
                    { id: 'p309', userName: '黑粉专业户', userTag: '', isVip: false, time: '6分钟前', device: 'Android', content: '太装了，这种话正常人说不出来，肯定是提前准备好的台词。', likes: 12, comments: 345, reposts: 8 },
                    { id: 'p310', userName: '予若守护', userTag: '真爱粉', isVip: false, time: '7分钟前', device: 'iPhone', content: '楼上那位，你不懂艺术家的浪漫就不要乱说！沈予这种深情是发自内心的！予若就是最配的！', likes: 4567, comments: 890, reposts: 345 }
                ]
            },
            { 
                id: 3, rank: 3, topic: "#江哲 湿身充电#", tag: "热", readCount: "8.1亿", discussCount: "28万", comments: [], 
                detailedPosts: [
                    { id: 'p311', userName: '姐狗天选', userTag: '年下控', isVip: true, time: '1分钟前', device: 'iPhone', content: '江哲湿身！还撒娇要抱抱充电！这是什么小奶狗！谁能拒绝淋湿的小狗！\n\n"姐姐能不能抱我一下？就一下，充电就好！"\n\n我直接去世！💕🐕', likes: 12345, comments: 2345, reposts: 890, tags: ['姐狗'], isHot: true },
                    { id: 'p312', userName: '姐狗CP头子', userTag: 'CP粉', isVip: false, time: '3分钟前', device: 'Android', content: '年下就是最香的！江哲这种直球又可爱的弟弟谁不爱！湿身诱惑+撒娇双重攻击，苏若怎么顶得住！', likes: 8901, comments: 1678, reposts: 678, tags: ['姐狗'] },
                    { id: 'p313', userName: '水军账号', userTag: '', isVip: false, time: '5分钟前', device: '微博网页版', content: '太幼稚了，这种撒娇适合高中生，不适合成年人。', likes: 5, comments: 234, reposts: 3 },
                    { id: 'p314', userName: '护哲小分队', userTag: '江哲粉丝', isVip: false, time: '6分钟前', device: 'iPhone', content: '什么叫幼稚？真诚和直球就是江哲的魅力！这种毫不掩饰的喜欢才是最珍贵的！你们不懂！', likes: 5678, comments: 1234, reposts: 456 }
                ]
            }
        ],
        cpRanking: [
            { 
                id: 1, name: "星苏", members: ["陆", "苏"], hot: 158000, desc: "性张力拉满", trend: 'up', tags: ["美帝", "成年人爱情"], 
                observerComment: "这绝对是名场面！这两人之间绝对有事！", 
                fanComments: ["嗑死我了！", "按头小分队集合！", "书架咚绝了！"], 
                relatedCharId: 'lu', 
                superTopic: { 
                    title: "星苏", level: "LV12", readCount: "12.5亿", postCount: "8.9万", 
                    posts: [
                        { id: 'cp301', userName: '星苏CP头子', userTag: '超话主持人', isVip: true, time: '刚刚', device: 'iPhone 14 Pro', content: '【炸裂！】图书馆书架咚！这是什么神仙名场面！\n\n"我可以不做那个克制的陆星辞了吗？"\n\n我直接昏迷！这是我能免费看的吗？？？\n\n#星苏# #书架咚#', likes: 23456, comments: 4567, reposts: 2345, tags: ['星苏'], isHot: true },
                        { id: 'cp302', userName: 'CP嗑学博士', userTag: '细节分析', isVip: true, time: '2分钟前', device: 'iPad Pro', content: '【显微镜分析】星苏书架咚的每一个细节：\n1. 白衬衫湿透透出肌肉线条\n2. 摘眼镜的瞬间，眼神从克制到危险\n3. 手指抵唇的"嘘" - 禁欲感拉满\n4. "这里没有摄像头" - 暗示了什么？\n\n结论：成年人之间的推拉！恋综天花板！', likes: 18902, comments: 3456, reposts: 1234, tags: ['星苏', '细节'], isHot: true },
                        { id: 'cp303', userName: '水军反串黑', userTag: '', isVip: false, time: '5分钟前', device: '微博网页版', content: '太假了，明显是剧本，这种情节一看就是安排好的。', likes: 8, comments: 1234, reposts: 5 },
                        { id: 'cp304', userName: '星苏护卫队', userTag: '真爱粉', isVip: false, time: '6分钟前', device: 'iPhone', content: '某些人是不是酸了？这种自然的化学反应能演出来？陆星辞的眼神、动作、语气，每一个细节都是真实的！不懂就别瞎说！我们星苏就是最真的！', likes: 8901, comments: 1678, reposts: 678 },
                        { id: 'cp305', userName: '嗑到昏迷', userTag: 'CP粉', isVip: false, time: '8分钟前', device: 'Android', content: '我宣布！星苏就是这一季的官配！书架咚这一下直接把我送走了！按头小分队在哪里！给我锁死这对！💑', likes: 14567, comments: 2789, reposts: 1123, tags: ['星苏'], isHot: true },
                        { id: 'cp306', userName: '理智粉', userTag: '', isVip: false, time: '10分钟前', device: 'iPhone', content: '虽然很甜，但希望大家理性嗑CP，不要过度解读。给嘉宾一些私人空间。', likes: 3456, comments: 567, reposts: 234 }
                    ]
                }
            },
            { 
                id: 2, name: "予若", members: ["沈", "苏"], hot: 112000, desc: "灵魂伴侣", trend: 'stable', tags: ["文艺", "走心"], 
                observerComment: "沈予这招以退为进很高明。", 
                fanComments: ["艺术组上大分！", "细水长流最浪漫！"], 
                relatedCharId: 'shen', 
                superTopic: { 
                    title: "予若_灵魂共振", level: "LV9", readCount: "8.5亿", postCount: "5.4万", 
                    posts: [
                        { id: 'cp307', userName: '予若CP粉', userTag: '文艺青年', isVip: true, time: '3分钟前', device: 'iPhone', content: '沈予的雨夜工作室！那个"你在我心里的比重，已经让我的世界失衡了"！这是什么神仙告白！文艺又深情！\n\n#予若# #灵魂伴侣#', likes: 8901, comments: 1678, reposts: 678, tags: ['予若'], isHot: true },
                        { id: 'cp308', userName: '艺术组', userTag: 'CP研究员', isVip: false, time: '7分钟前', device: 'iPad', content: '【深度解读】沈予这段话完美诠释了建筑师和插画师的浪漫！建筑需要平衡与支撑，而你成了他的支点！这是什么绝美设定！', likes: 6789, comments: 1234, reposts: 567, tags: ['予若'] },
                        { id: 'cp309', userName: '黑粉专业户', userTag: '', isVip: false, time: '9分钟前', device: 'Android', content: '太装了，这种话正常人说不出来，肯定是提前准备好的台词。', likes: 12, comments: 456, reposts: 8 },
                        { id: 'cp310', userName: '予若守护', userTag: '真爱粉', isVip: false, time: '10分钟前', device: 'iPhone', content: '楼上那位，你不懂艺术家的浪漫就不要乱说！沈予这种深情是发自内心的！予若就是最配的！', likes: 4567, comments: 890, reposts: 345 }
                    ]
                }
            },
            { 
                id: 3, name: "姐狗", members: ["江", "苏"], hot: 98000, desc: "直球热烈", trend: 'up', tags: ["年下", "撒娇"], 
                observerComment: "谁能拒绝一只淋湿的小狗呢？", 
                fanComments: ["修勾谁不爱！", "年下就是最香的！"], 
                relatedCharId: 'jiang', 
                superTopic: { 
                    title: "苏苏的修勾", level: "LV8", readCount: "5.5亿", postCount: "3.2万", 
                    posts: [
                        { id: 'cp311', userName: '姐狗天选', userTag: '年下控', isVip: true, time: '4分钟前', device: 'iPhone', content: '江哲湿身！还撒娇要抱抱充电！这是什么小奶狗！谁能拒绝淋湿的小狗！\n\n"姐姐能不能抱我一下？就一下，充电就好！"\n\n我直接去世！💕🐕', likes: 12345, comments: 2345, reposts: 890, tags: ['姐狗'], isHot: true },
                        { id: 'cp312', userName: '姐狗CP头子', userTag: 'CP粉', isVip: false, time: '8分钟前', device: 'Android', content: '年下就是最香的！江哲这种直球又可爱的弟弟谁不爱！湿身诱惑+撒娇双重攻击，苏若怎么顶得住！', likes: 8901, comments: 1678, reposts: 678, tags: ['姐狗'] },
                        { id: 'cp313', userName: '水军账号', userTag: '', isVip: false, time: '11分钟前', device: '微博网页版', content: '太幼稚了，这种撒娇适合高中生，不适合成年人。', likes: 5, comments: 345, reposts: 3 },
                        { id: 'cp314', userName: '护哲小分队', userTag: '江哲粉丝', isVip: false, time: '12分钟前', device: 'iPhone', content: '什么叫幼稚？真诚和直球就是江哲的魅力！这种毫不掩饰的喜欢才是最珍贵的！你们不懂！', likes: 5678, comments: 1234, reposts: 456 }
                    ]
                }
            }
        ],
        observerDiscussion: [
            { id: 'ob1', author: '李雪琴', role: '嗑學家', title: '【尖叫】陸星辭瘋了吧！！', content: '圖書館那個書架咚！那個摘眼鏡！還有那句“我可以不做那個克制的陸星辭了嗎”！救命啊！這是偶像劇都不敢這麼拍的程度！', time: '2分鐘前', replies: 3450 }
        ],
        fanDiscussions: [
            { id: 'f1', username: '陸總的眼鏡', content: '啊啊啊啊啊啊啊啊啊啊啊！（尖叫）', likes: 5000, avatarColor: 'bg-purple-400' },
            { id: 'f2', username: '沈予的畫筆', content: '雨夜工作室那一段真的好浪漫，成年人的推拉。', likes: 2800, avatarColor: 'bg-blue-400' },
            { id: 'f3', username: '江哲的籃球', content: '弟弟濕身誘惑誰頂得住啊！', likes: 3200, avatarColor: 'bg-yellow-400' }
        ]
    },
    'ep9': {
         hotSearches: [
            { id: 1, rank: 1, topic: "#心動5最終抉擇#", tag: "爆", readCount: "35亿", discussCount: "150萬", comments: [], detailedPosts: [] },
            { id: 2, rank: 2, topic: "#蘇若到底選誰#", tag: "沸", readCount: "18亿", discussCount: "80萬", comments: [], detailedPosts: [] },
            { id: 3, rank: 3, topic: "#陸星辭 餘生合約#", tag: "热", readCount: "10亿", discussCount: "40萬", comments: [], detailedPosts: [] },
            { id: 4, rank: 4, topic: "#江哲 機車婚禮#", tag: "新", readCount: "8亿", discussCount: "25萬", comments: [], detailedPosts: [] }
        ],
        cpRanking: [
             { id: 1, name: "星蘇", members: ["陸", "蘇"], hot: 500000, desc: "全網都在嗑", trend: 'up', tags: ["斷層第一"], observerComment: "如果是這個結局，那就是戀綜天花板。", fanComments: [], relatedCharId: 'lu', superTopic: { title: "星蘇", level: "LV20", readCount: "50億", postCount: "50萬", posts: [] } },
             { id: 2, name: "姐狗", members: ["江", "蘇"], hot: 450000, desc: "意難平還是HE?", trend: 'stable', tags: ["虐戀情深"], observerComment: "這一對讓人心疼。", fanComments: [], relatedCharId: 'jiang', superTopic: { title: "姐狗", level: "LV18", readCount: "40億", postCount: "40萬", posts: [] } },
             { id: 3, name: "予若", members: ["沈", "蘇"], hot: 420000, desc: "神仙眷侶", trend: 'stable', tags: ["白月光"], observerComment: "最完美的結局。", fanComments: [], relatedCharId: 'shen', superTopic: { title: "予若", level: "LV18", readCount: "35億", postCount: "35萬", posts: [] } }
        ],
        observerDiscussion: [
             { id: 'ob1', author: '全體偵探', role: '觀察團', title: '【淚目】這一季真的封神了', content: '無論蘇若選誰，這都是我們看過最真誠的一季。感謝他們帶給我們的感動。', time: '剛剛', replies: 9999 }
        ],
        fanDiscussions: [
            { id: 'f1', username: 'HE愛好者', content: '求求了，一定要是星蘇啊！他們是天造地設的一對！', likes: 10000, avatarColor: 'bg-red-400' },
            { id: 'f2', username: '年下不香嗎', content: '江哲那麼好，蘇若不要選他我會哭死的！', likes: 8000, avatarColor: 'bg-orange-400' },
            { id: 'f3', username: '理智粉', content: '沈予最適合過日子，希望能選沈予。', likes: 6000, avatarColor: 'bg-blue-400' }
        ]
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EPISODE_MESSAGES: Record<string, PostEpisodeMessage[]> = {
    'ep1': [
        { charId: 'lu', text: "今天辛苦了。早點休息，明天見。" },
        { charId: 'shen', text: "別野的枕頭如果不舒服，可以告訴我。" },
        { charId: 'jiang', text: "姐姐晚安！今晚一定要夢到我哦！🌙" }
    ],
    // ... 其他集数消息
};

// --- 3. 组件定义 ---

const GlassBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-[#120024] via-[#220033] to-[#0a0a20]">
            <div className="absolute top-[-10%] left-[20%] w-[300px] h-[300px] bg-purple-600/40 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-600/30 rounded-full blur-[120px]" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-[40%] left-[-10%] w-[200px] h-[200px] bg-blue-600/30 rounded-full blur-[80px]" style={{animationDelay: '4s'}}></div>
            <Star className="absolute top-20 right-10 text-yellow-400/50 w-6 h-6 animate-spin-slow" />
            <Sparkle className="absolute bottom-32 left-8 text-pink-300/50 w-8 h-8 animate-pulse" />
        </div>
    );
};

const HeartBloom = () => {
    // 使用惰性初始化避免在渲染期间调用 Math.random()
    const [heartPositions] = useState<Array<{
        left: number;
        animationDelay: number;
        animationDuration: number;
        scale: number;
    }>>(() => {
        return Array.from({ length: 15 }).map(() => ({
            left: Math.random() * 100,
            animationDelay: Math.random() * 0.5,
            animationDuration: 2 + Math.random() * 2,
            scale: 0.5 + Math.random()
        }));
    });

    return <div className="absolute inset-0 overflow-hidden z-[160] pointer-events-none">
        {heartPositions.map((heart, i) => (
            <div key={i} className="absolute bottom-0 text-pink-400 animate-floatUp" style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.animationDelay}s`,
                animationDuration: `${heart.animationDuration}s`,
                transform: `scale(${heart.scale})`,
                opacity: 0
            }}><Heart fill="currentColor" size={24} /></div>
        ))}
    </div>;
};

const EpisodeOpening = ({ scenario, onFinished }: { scenario: StoryScenario, onFinished: () => void }) => {
    const onFinishedRef = useRef(onFinished);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // 更新 ref 以始终使用最新的回调
    useEffect(() => {
        onFinishedRef.current = onFinished;
    }, [onFinished]);
    
    // 设置定时器，只执行一次
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            onFinishedRef.current();
        }, 4000);
        
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []); // 空依赖数组，只在组件挂载时执行一次

    const handleSkip = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        onFinishedRef.current();
    };

    return (
        <div 
            className="fixed inset-0 z-[200] bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center overflow-hidden animate-fadeIn cursor-pointer"
            onClick={handleSkip}
        >
            {/* 背景模糊的封面图 */}
            <div className="absolute inset-0 z-0 opacity-20">
                <img src={scenario.coverImage} className="w-full h-full object-cover blur-2xl scale-110" />
            </div>
            
            {/* 拍摄设备网格覆盖层 */}
            <div className="absolute inset-0 z-[5] opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>
            
            {/* 摄像机视角边框 */}
            <div className="absolute inset-4 border-4 border-red-500/30 rounded-lg z-[6] animate-pulse"></div>
            <div className="absolute inset-6 border-2 border-white/20 rounded-lg z-[6]"></div>
            
            {/* 左上角：拍摄信息 */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-red-500/50">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-red-400 font-mono text-sm font-bold tracking-widest">REC</span>
                    <span className="text-white/60 font-mono text-xs">00:00:00:00</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                    <span className="text-white/80 font-mono text-xs">CAM 01 • 4K • 24fps</span>
                </div>
            </div>
            
            {/* 右上角：节目信息 */}
            <div className="absolute top-6 right-6 z-10 text-right">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-pink-500/50">
                    <div className="text-pink-400 font-bold text-lg mb-1 flex items-center gap-2 justify-end">
                        <Heart size={20} fill="currentColor" className="animate-pulse" />
                        心动信号 5
                    </div>
                    <div className="text-white/60 text-xs font-mono">2026 夏季档</div>
                </div>
            </div>
            
            {/* 中央内容区域 */}
            <div className="relative z-10 text-center space-y-6 px-8">
                {/* 章节标识 */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-px w-16 bg-pink-500/50"></div>
                    <div className="text-pink-400 font-mono text-sm tracking-[0.5em] animate-slideDown border border-pink-500/50 px-4 py-2 rounded-full bg-pink-500/10 backdrop-blur-sm">
                        {scenario.phase}
                    </div>
                    <div className="h-px w-16 bg-pink-500/50"></div>
                </div>
                
                {/* 章节标题 */}
                <h1 className="text-6xl md:text-7xl font-black text-white italic tracking-tight uppercase drop-shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-glitch">
                    {scenario.episodeTitle}
                </h1>
                
                {/* 标语 */}
                <p className="text-white/90 text-xl font-light tracking-wider animate-fadeIn delay-700 italic px-8">
                    「 {scenario.slogan} 」
                </p>

                {/* 拍摄状态指示器 */}
                <div className="mt-8 flex items-center justify-center gap-4 animate-pulse">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                        <span className="text-green-400 text-xs font-mono font-bold">ON AIR</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-blue-500/50">
                        <Clapperboard size={16} className="text-blue-400" />
                        <span className="text-blue-400 text-xs font-mono">拍摄中</span>
                    </div>
                </div>
            </div>
            
            {/* 底部：拍摄时间轴 */}
            <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-white/80 font-mono text-xs">
                            <span className="text-pink-400">时间码</span> 00:00:00:00
                        </div>
                        <div className="h-4 w-px bg-white/30"></div>
                        <div className="text-white/60 font-mono text-xs">
                            场景: {scenario.location}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MonitorPlay size={16} className="text-white/60" />
                        <span className="text-white/60 font-mono text-xs">多机位录制</span>
                    </div>
                </div>
            </div>
            
            {/* 摄像机图标装饰 */}
            <div className="absolute bottom-20 left-12 z-[8] opacity-30">
                <Clapperboard size={64} className="text-pink-500/30 rotate-12" />
            </div>
            <div className="absolute top-20 right-16 z-[8] opacity-30">
                <Film className="text-purple-500/30 -rotate-12" size={48} />
            </div>
            
            {/* 扫描线效果 */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-scanline"></div>
            
            {/* 跳过提示 */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono animate-pulse pointer-events-none z-20 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                点击跳过开场
            </div>
        </div>
    );
};

// 邀请卡片组件（使用背景图片）
const InvitationCard = ({ scenario: _scenario, onConfirm }: { scenario: StoryScenario, onConfirm: () => void }) => {
    // 背景图片URL - 使用 public/images/kaipian.gif
    const backgroundImageUrl = '/images/kaipian.gif';
    
    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn overflow-hidden cursor-pointer"
            onClick={onConfirm}
        >
            {/* 背景图片 - 全屏显示 */}
            <img 
                src={backgroundImageUrl}
                alt="邀请函"
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* 确认按钮 - 底部居中 */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onConfirm();
                }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-lg shadow-2xl hover:bg-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group border-2 border-white/40"
            >
                <Sparkles size={20} className="group-hover:animate-pulse" />
                <span>接受邀请</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* 点击提示 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono animate-pulse pointer-events-none z-10">
                点击任意位置继续
            </div>
        </div>
    );
};

// 欢迎文字组件
const WelcomeText = ({ onContinue }: { onContinue: () => void }) => {
    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-indigo-900/95 backdrop-blur-sm"
            onClick={onContinue}
        >
            <div className="max-w-2xl mx-auto px-8 text-center space-y-8">
                {/* 标题 */}
                <h1 className="text-5xl font-bold text-white mb-8 animate-slideUp" style={{ 
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
                    fontFamily: 'serif'
                }}>
                    欢迎来到《心动小屋》
                </h1>
                
                {/* 欢迎文字 */}
                <div className="space-y-6 text-white/90 text-xl leading-relaxed animate-fadeIn" style={{ 
                    animationDelay: '0.3s',
                    animationFillMode: 'both'
                }}>
                    <p className="text-2xl font-medium">
                        你是第4位入住的女嘉宾。
                    </p>
                    <p className="text-lg">
                        深吸一口气，推开别墅的大门，属于你的恋爱故事即将开始.......
                    </p>
                </div>
                
                {/* 继续按钮 */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onContinue();
                    }}
                    className="mt-12 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-lg shadow-2xl hover:bg-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group border-2 border-white/40 mx-auto"
                >
                    <span>进入心动小屋</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* 点击提示 */}
                <div className="mt-6 text-white/60 text-sm font-mono animate-pulse pointer-events-none">
                    点击任意位置继续
                </div>
            </div>
        </div>
    );
};

// 全屏剧情体验组件（视觉小说风格）
const FullScreenStoryView = ({ 
    scenario, 
    option, 
    onClose, 
    onComplete 
}: { 
    scenario: StoryScenario, 
    option: StoryOption | null,
    onClose: () => void,
    onComplete: () => void
}) => {
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueText, setDialogueText] = useState('');
    
    // 生成对话序列（如果没有对话数据，从story_result拆分）
    const dialogues = useMemo(() => {
        if (option?.dialogues && option.dialogues.length > 0) {
            return option.dialogues;
        }
        
        const result: Dialogue[] = [];
        
        // 1. 先添加 intro（如果有）
        if (option?.intro) {
            result.push({
                speaker: 'narrator',
                text: option.intro
            } as Dialogue);
        }
        
        // 2. 解析 story_result，提取所有对话和旁白
        if (option?.story_result) {
            const fullText = option.story_result;
            const characterId = CHARACTERS.find(c => c.name === option.target)?.id;
            
            // 使用正则表达式匹配所有引号中的内容（支持中文引号和英文引号）
            const quotePattern = /[""](.*?)[""]/g;
            let lastIndex = 0;
            let match;
            
            while ((match = quotePattern.exec(fullText)) !== null) {
                // 添加引号前的旁白（如果有）
                const beforeQuote = fullText.substring(lastIndex, match.index).trim();
                if (beforeQuote) {
                    // 按段落分割旁白
                    const narratorLines = beforeQuote.split('\n\n').filter(l => l.trim());
                    narratorLines.forEach(line => {
                        result.push({
                            speaker: 'narrator',
                            text: line
                        } as Dialogue);
                    });
                }
                
                // 添加对话
                result.push({
                    speaker: option.target,
                    text: match[1],
                    characterId: characterId
                } as Dialogue);
                
                lastIndex = match.index + match[0].length;
            }
            
            // 添加最后剩余的旁白（如果有）
            const afterLastQuote = fullText.substring(lastIndex).trim();
            if (afterLastQuote) {
                const narratorLines = afterLastQuote.split('\n\n').filter(l => l.trim());
                narratorLines.forEach(line => {
                    result.push({
                        speaker: 'narrator',
                        text: line
                    } as Dialogue);
                });
            }
            
            // 如果没有找到任何引号，将整个文本作为旁白
            // 检查是否只添加了 intro（如果有的话）
            const onlyIntroAdded = option.intro && result.length === 1 && result[0].speaker === 'narrator' && result[0].text === option.intro;
            if (onlyIntroAdded || (!option.intro && result.length === 0)) {
                const lines = fullText.split('\n\n').filter(l => l.trim());
                lines.forEach(line => {
                    result.push({
                        speaker: 'narrator',
                        text: line
                    } as Dialogue);
                });
            }
        }
        
        // 如果没有任何内容，返回默认文本
        if (result.length === 0) {
            result.push({
                speaker: 'narrator',
                text: scenario.text || '劇情即將開始...'
            } as Dialogue);
        }
        
        return result;
    }, [option, scenario]);

    const currentDialogue = dialogues[currentDialogueIndex];
    const currentCharacter = currentDialogue?.characterId 
        ? CHARACTERS.find(c => c.id === currentDialogue.characterId)
        : null;

    // 文本逐字显示效果
    useEffect(() => {
        if (showDialogue && currentDialogue) {
            setDialogueText('');
            const fullText = currentDialogue.text;
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < fullText.length) {
                    setDialogueText(fullText.slice(0, charIndex + 1));
                    charIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [currentDialogueIndex, showDialogue, currentDialogue]);

    useEffect(() => {
        // 显示剧情介绍后，延迟显示对话（移动端缩短延迟时间）
        const delay = window.innerWidth <= 768 ? 500 : 2000;
        const timer = setTimeout(() => {
            setShowDialogue(true);
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    const handleNextDialogue = () => {
        if (!showDialogue || dialogueText !== currentDialogue?.text) {
            // 如果还在打字中，直接显示完整文本
            setDialogueText(currentDialogue?.text || '');
            return;
        }
        
        if (currentDialogueIndex < dialogues.length - 1) {
            setCurrentDialogueIndex(currentDialogueIndex + 1);
            setDialogueText('');
        } else {
            // 对话结束，完成剧情
            onComplete();
        }
    };
    
    // 跳过对话功能
    const handleSkipDialogue = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 直接完成所有对话，跳到最后
        onComplete();
    };

    return (
        <div 
            className="fixed inset-0 z-[200] bg-black flex flex-col animate-fadeIn cursor-pointer"
            onClick={handleNextDialogue}
        >
            {/* 背景图片 */}
            <div className="absolute inset-0">
                <img 
                    src={option?.avatar || scenario.coverImage} 
                    className={`w-full h-full object-cover ${
                        option?.id === 'opt-lu-ep1' ? 'opacity-60' : 'opacity-30'
                    }`}
                    style={option?.id === 'opt-lu-ep1' ? { filter: 'brightness(1.2)' } : {}}
                    alt="背景"
                />
                <div 
                    className={`absolute inset-0 bg-gradient-to-t ${
                        option?.id === 'opt-lu-ep1' 
                            ? 'from-black/40 via-black/30 to-black/20' 
                            : 'from-black via-black/60 to-black/40'
                    }`}
                ></div>
            </div>

            {/* 人物立绘区域 - 移动端优化 */}
            <div className="relative flex-1 flex items-end justify-center pb-24 sm:pb-32 px-2">
                {currentCharacter && currentDialogue?.speaker !== 'narrator' && (
                    <div className="relative max-w-md w-full mx-auto animate-fadeIn">
                        <img 
                            src={currentCharacter.avatarImage} 
                            alt={currentCharacter.name}
                            className="w-full h-auto object-contain drop-shadow-2xl"
                            style={{ maxHeight: '60vh' }}
                        />
                        {/* 名字标签 - 移动端优化 */}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/60 backdrop-blur-md px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-white/20">
                            <span className="text-white font-bold text-sm sm:text-lg">{currentCharacter.name}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 对话框区域 - 移动端优化 */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 pb-6 sm:pb-8 animate-slideUp safe-area-bottom z-50">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-end gap-2 sm:gap-4">
                    {/* 说话者名字标签 */}
                    {currentDialogue && currentDialogue.speaker !== 'narrator' && (
                        <div className="flex-shrink-0 mb-0 sm:mb-2 w-full sm:w-auto z-50">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap inline-block">
                                <span className="text-white font-bold text-sm sm:text-base">
                                    {currentDialogue.speaker}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* 对话内容 */}
                    <div className="flex-1 w-full bg-black/90 backdrop-blur-xl border-2 border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl relative min-h-[100px] sm:min-h-[120px] flex items-center z-50">
                        {/* 装饰元素 */}
                        <div className="absolute top-2 left-2 w-2 h-2 bg-pink-500 rounded-full opacity-50"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full opacity-50"></div>
                        
                        <p className="text-white text-base sm:text-lg leading-relaxed font-light flex-1 break-words relative z-10">
                            {showDialogue ? (dialogueText || currentDialogue?.text || '') : (currentDialogue?.text || '')}
                            {dialogueText === currentDialogue?.text && (
                                <span className="inline-block ml-2 w-2 h-4 sm:h-6 bg-pink-400 animate-pulse"></span>
                            )}
                        </p>
                        
                        {/* 提示点击继续 */}
                        {dialogueText === currentDialogue?.text && currentDialogue && (
                            <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-6 text-white/70 text-xs animate-pulse flex items-center gap-2 z-20">
                                <span className="hidden sm:inline">点击继续</span>
                                <span className="sm:hidden">点击</span>
                                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 关闭按钮 - 移动端优化 */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10 touch-manipulation"
            >
                <X size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* 跳过对话按钮 - 移动端优化 */}
            <button
                onClick={handleSkipDialogue}
                className="absolute top-2 sm:top-4 left-2 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white hover:bg-black/80 transition-colors z-10 text-xs sm:text-sm font-medium touch-manipulation"
            >
                <Zap size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">跳过对话</span>
                <span className="sm:hidden">跳过</span>
            </button>
        </div>
    );
};

const EpisodeDetailModal = ({ scenario, onClose, onOptionClick, isCurrent, isCompleted, isLocked, onStartStory, completedOptions }: { 
    scenario: StoryScenario, 
    onClose: () => void, 
    onOptionClick: (id: string) => void,
    isCurrent: boolean,
    isCompleted: boolean,
    isLocked: boolean,
    onStartStory?: (option: StoryOption) => void,
    completedOptions?: Set<string>
}) => {
    // 如果当前场景已完成至少一个选项，也显示其他角色选项
    const hasCompletedOption = completedOptions && scenario.options.some(opt => completedOptions.has(opt.id));
    const showSideStories = isCompleted || (isCurrent && hasCompletedOption);
    return (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex flex-col animate-scaleUp">
            {/* Modal Header (Tools) */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 relative z-20">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-pink-500 border border-pink-500 px-2 py-0.5 rounded">{scenario.phase}</span>
                    <h2 className="text-lg font-bold text-white line-clamp-1">{scenario.episodeTitle}</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                    <XCircle size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative">
                {/* Poster / Cover */}
                <div className="h-64 relative">
                    <img src={scenario.coverImage} className={`w-full h-full object-cover ${isLocked ? 'grayscale blur-sm' : ''}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120024] via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-xl text-white/90 italic font-serif leading-relaxed">“ {scenario.slogan} ”</p>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-6">
                    {/* Story Text */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Film size={14} /> Storyline
                        </h3>
                        <p className="text-sm text-white/80 leading-7 font-light">
                            {isLocked ? "劇情尚未解鎖，敬請期待..." : scenario.text}
                        </p>
                    </div>

                    {/* Director's Mission (Shown if Current or Completed) */}
                    {!isLocked && (
                        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-4 rounded-xl border border-pink-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <Clapperboard size={64} className="text-pink-500" />
                            </div>
                            <h3 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10">
                                <Megaphone size={14} /> Director's Mission
                            </h3>
                            <p className="text-sm font-bold text-white relative z-10">
                                {scenario.directorMission}
                            </p>
                        </div>
                    )}

                    {/* 剧情开始按钮（如果解锁） */}
                    {!isLocked && (
                        <div className="pt-4">
                            <button 
                                onClick={() => {
                                    onClose();
                                    // 如果有选项，默认选择第一个；否则直接显示剧情介绍
                                    if (scenario.options.length > 0 && onStartStory) {
                                        onStartStory(scenario.options[0]);
                                    }
                                }}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white rounded-xl font-bold text-base shadow-lg shadow-pink-900/50 hover:shadow-pink-600/50 active:scale-95 transition-all flex items-center justify-center gap-3 group border border-white/20"
                            >
                                <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
                                <span>开始剧情</span>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Options (Only if Current, but not for ep1 - ep1 will auto-play all dialogues) */}
                    {isCurrent && scenario.id !== 'ep1' && (
                        <div className="space-y-3 pt-2">
                            {scenario.options.map(opt => {
                                const isOptionCompleted = completedOptions?.has(opt.id);
                                return (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => {
                                            if (onStartStory) {
                                                onStartStory(opt);
                                                onClose();
                                            } else {
                                                onOptionClick(opt.id);
                                            }
                                        }} 
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group active:scale-[0.98] ${
                                            isOptionCompleted 
                                                ? 'bg-purple-900/30 border-purple-500/30 hover:bg-purple-600/50 hover:border-purple-400' 
                                                : 'bg-white/10 border-white/10 hover:bg-pink-600/80 hover:border-pink-500'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 transition-colors ${
                                            isOptionCompleted 
                                                ? 'border-purple-400/40 group-hover:border-purple-300' 
                                                : 'border-white/20 group-hover:border-white'
                                        }`}>
                                            <img src={opt.avatar} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-white text-sm group-hover:text-white transition-colors">{opt.label}</h4>
                                                {isOptionCompleted && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-green-500/30 text-green-200 rounded font-bold">已完成</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-white/50 line-clamp-1 group-hover:text-white/80">{opt.desc}</p>
                                        </div>
                                        <ChevronRight size={20} className="text-white/30 group-hover:text-white" />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Side Stories (如果已完成或当前场景已完成至少一个选项) */}
                    {showSideStories && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={14} className="text-purple-400" />
                                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">其他角色</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                            </div>
                            {scenario.options.map((opt) => {
                                const isOptionCompleted = completedOptions?.has(opt.id);
                                return (
                                    <button 
                                        key={`side-${opt.id}`} 
                                        onClick={() => onOptionClick(opt.id)} 
                                        className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 hover:from-purple-600/50 hover:to-pink-600/50 hover:border-purple-400 transition-all flex items-center gap-4 group active:scale-[0.98] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-colors"></div>
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-400/40 group-hover:border-purple-300 transition-colors relative z-10">
                                            <img src={opt.avatar} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                                            {isOptionCompleted && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <ThumbsUp size={12} className="text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 relative z-10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-white text-sm group-hover:text-purple-200 transition-colors">{opt.label}</h4>
                                                {isOptionCompleted && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-green-500/30 text-green-200 rounded font-bold">已完成</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-white/60 line-clamp-1 group-hover:text-white/80">{opt.desc}</p>
                                        </div>
                                        <ChevronRight size={20} className="text-purple-400/50 group-hover:text-purple-300 relative z-10" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Footer Status */}
                    <div className="text-center pt-8 pb-4">
                        {isLocked && <span className="text-xs font-mono text-white/30 border border-white/10 px-3 py-1 rounded-full">LOCKED</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ObserverPostItem = ({ post }: { post: ObserverPost }) => (
    <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg mb-3 hover:bg-white/15 transition-all">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-300 border border-purple-500/30">
                    {post.author[0]}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white/90">{post.author}</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 rounded border border-purple-500/30">{post.role}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{post.time}</span>
                </div>
            </div>
            <div className="flex items-center gap-1 text-white/40 text-xs">
                <MessageSquareText size={12} /> {post.replies}
            </div>
        </div>
        <h4 className="font-bold text-white/90 text-sm mb-1">{post.title}</h4>
        <p className="text-xs text-white/70 leading-relaxed">{post.content}</p>
    </div>
);

const FanDiscussionItem = ({ comment }: { comment: FanDiscussion }) => (
    <div className="relative mb-3 group animate-fadeIn">
        <div className={`absolute -left-1 -top-1 w-full h-full rounded-2xl ${comment.avatarColor} opacity-20 blur-sm group-hover:opacity-40 transition-opacity`}></div>
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-md relative flex gap-3 items-start">
            <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-gray-800 shadow-inner border-2 border-white/50 ${comment.avatarColor}`}>
                {comment.username[0]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-pink-200">{comment.username}</span>
                    <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded-full">
                        <LikeIcon size={8} className="text-pink-400" />
                        <span className="text-[9px] text-pink-200 font-mono">{comment.likes}</span>
                    </div>
                </div>
                <p className="text-xs text-white/90 leading-tight">{comment.content}</p>
            </div>
        </div>
    </div>
);

const ObservationRoomModal = ({ posts, onClose }: { posts: ObserverPost[], onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-gray-900/80 w-full max-w-sm rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp backdrop-blur-xl border border-white/10">
                {/* Header */}
                <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-500 p-1.5 rounded-lg text-white shadow-lg shadow-purple-500/30">
                            <MessageSquareCode size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">心动侦探社</h3>
                            <p className="text-[10px] text-white/50">本期觀察室熱議</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-1.5 rounded-full text-white/70 hover:bg-white/20 transition-colors"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {posts.map(post => <ObserverPostItem key={post.id} post={post} />)}
                    <div className="text-center text-xs text-white/30 mt-4">--- 更多討論見APP論壇 ---</div>
                </div>
            </div>
        </div>
    );
};

const WeiboDetailView = ({ topic, onBack }: { topic: HotSearchItem | CPItem['superTopic'] & {topic?:string}, onBack: () => void }) => {
    const isHotSearchItem = (t: typeof topic): t is HotSearchItem => 'detailedPosts' in t || 'discussCount' in t;
    
    const title = isHotSearchItem(topic) ? topic.topic : topic.title;
    const initialPosts = isHotSearchItem(topic) 
        ? (topic.detailedPosts || [])
        : topic.posts || [];
    const readCount = isHotSearchItem(topic) ? topic.readCount : topic.readCount;
    const discussCount = isHotSearchItem(topic) ? topic.discussCount : topic.postCount;
    const level = isHotSearchItem(topic) ? undefined : topic.level;

    const [posts, setPosts] = useState(initialPosts || []);
    const [inputText, setInputText] = useState("");

    const handleSendPost = () => {
        if (!inputText.trim()) return;
        const newPost: WeiboPost = {
            id: `new_${Date.now()}`,
            userName: "我",
            userAvatar: PROTAGONIST.avatar,
            userTag: "吃瓜群众",
            isVip: false,
            time: "剛剛",
            device: "LoveSignal App",
            content: inputText,
            likes: 0,
            comments: 0,
            reposts: 0
        };
        setPosts([newPost, ...posts]);
        setInputText("");
    };

    return (
        <div className="flex flex-col h-full bg-[#121212]/95 backdrop-blur-xl absolute inset-0 z-50 animate-slideInRight">
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-sm sticky top-0 z-10 backdrop-blur-md">
                <button onClick={onBack} className="text-white/70 hover:bg-white/10 p-1 rounded-full"><ArrowLeft size={22} /></button>
                <span className="font-bold text-base text-white">話題詳情</span>
                <MoreHorizontal size={22} className="text-white/70" />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="bg-white/5 p-4 mb-2 border-b border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden border border-white/10">
                            {title.includes("CP") || title.includes("星苏") || title.includes("予若") || title.includes("姐狗") ? <Heart size={32} fill="currentColor" /> : <Hash size={32} />}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-white leading-tight mb-1">{title.replace(/#/g, '')}</h2>
                            <div className="flex items-center gap-3 text-xs text-white/50"><span>閱讀 {readCount}</span><span>討論 {discussCount}</span></div>
                            {level && <div className="mt-1 text-[10px] text-yellow-500 font-bold flex items-center gap-1"><Gem size={12} /> {level}</div>}
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white/5 p-4 animate-fadeIn border-b border-white/5">
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">{post.userAvatar ? <img src={post.userAvatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-white/50"/>}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1"><span className={`text-sm font-bold ${post.isVip ? 'text-orange-400' : 'text-white'}`}>{post.userName}</span>{post.userTag && <span className="bg-pink-500/20 text-pink-300 text-[9px] px-1.5 rounded border border-pink-500/30">{post.userTag}</span>}</div>
                                        <div className="text-[10px] text-white/40 flex items-center gap-1"><span>{post.time}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-white/80 leading-6 mb-3 whitespace-pre-line">{post.content}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* 底部評論欄 */}
            <div className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-3 backdrop-blur-md">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="參與話題討論..." 
                    className="flex-1 h-9 bg-white/10 rounded-full px-4 text-xs text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-pink-500/50 transition-all border border-transparent focus:border-pink-500/30"
                />
                <button onClick={handleSendPost} className="text-pink-500 font-bold text-sm disabled:opacity-50" disabled={!inputText.trim()}>發送</button>
            </div>
        </div>
    );
};

const CalendarView = ({ onClose }: { onClose: () => void }) => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-gray-900/90 w-full max-w-sm rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] border border-white/10">
                <div className="bg-white/5 p-6 pb-4 border-b border-white/10">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24} /></button>
                    <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2"><BookHeart className="text-pink-500" /> 心动日历</h2>
                    <p className="text-xs text-white/50 mt-1">记录在这个小屋里的每一个心动瞬间</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-4 gap-3">
                        {days.map(day => {
                            const event = CALENDAR_EVENTS.find(e => e.date === day);
                            return (
                                <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-transform ${event ? 'cursor-pointer hover:scale-105 shadow-lg border border-white/10' : 'bg-white/5 text-white/20'}`} onClick={() => event && setSelectedEvent(event)}>
                                    {event ? (
                                        <>
                                            {event.isUnlocked ? (<img src={event.img} className="absolute inset-0 w-full h-full object-cover opacity-80" />) : (<div className="absolute inset-0 bg-white/5 flex items-center justify-center"><Lock size={16} className="text-white/30" /></div>)}
                                            <div className="absolute top-1 left-1 bg-black/60 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm border border-white/10">{day}</div>
                                            {event.isUnlocked && (<div className="absolute bottom-1 right-1">{event.type === 'story' && <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />}{event.type === 'date' && <Heart size={12} className="text-pink-500 fill-pink-500" />}{event.type === 'special' && <Star size={12} className="text-purple-400 fill-purple-400" />}</div>)}
                                        </>
                                    ) : (<span className="text-sm font-bold">{day}</span>)}
                                </div>
                            )
                        })}
                    </div>
                </div>
                {selectedEvent && selectedEvent.isUnlocked && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col p-6 animate-fadeIn">
                        <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-white/10 rounded-full p-1 text-white hover:bg-white/20"><X size={20} /></button>
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl mb-6 rotate-2 border-2 border-white/20"><img src={selectedEvent.img} className="w-full h-full object-cover" /></div>
                            <h3 className="text-2xl font-bold text-white mb-2 font-serif">{selectedEvent.title}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded text-xs font-bold uppercase border border-pink-500/30">Day {selectedEvent.date}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${selectedEvent.type === 'story' ? 'bg-yellow-500/80' : selectedEvent.type === 'date' ? 'bg-pink-500/80' : 'bg-purple-500/80'}`}>{selectedEvent.type === 'story' ? '主线剧情' : selectedEvent.type === 'date' ? '浪漫约会' : '特殊事件'}</span>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed max-w-xs">{selectedEvent.desc}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MaleLeadStatusCard = ({ char, onOpenDiary, onOpenProfile }: { char: Character, onOpenDiary: (charId: string) => void, onOpenProfile: (charId: string) => void }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg mb-3 relative overflow-hidden group hover:bg-white/10 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-3">
                <div className="relative cursor-pointer" onClick={(e) => { e.stopPropagation(); onOpenProfile(char.id); }}>
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-purple-600">
                        <img src={char.avatarImage} alt={char.name} className="w-full h-full rounded-full object-cover border-2 border-black/50" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full px-1.5 py-0.5 border border-black text-[8px] font-bold shadow-sm">
                       {char.stats.trait.split('·')[0]}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-bold text-white">{char.name}</h3>
                        <div className="flex gap-1">
                             <button 
                                onClick={(e) => { e.stopPropagation(); onOpenProfile(char.id); }}
                                className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full hover:bg-white/20 flex items-center gap-1 transition-colors border border-white/5"
                            >
                                <Info size={10} /> 详情
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onOpenDiary(char.id); }}
                                className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full hover:bg-pink-500/30 flex items-center gap-1 transition-colors border border-pink-500/20"
                            >
                                <BookOpen size={10} /> 私密日记
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="flex items-center gap-1 text-pink-400">
                            <Heart size={10} fill="currentColor" className="animate-pulse" /> 心动 {char.stats.heartbeat}
                        </div>
                        <div className="flex items-center gap-1 text-purple-400">
                            <Zap size={10} fill="currentColor" /> 醋意 {char.stats.jealousy}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatDetailView = ({ chat, char, onBack, onSend }: { chat: ChatContact, char?: Character, onBack: () => void, onSend: (txt: string) => void }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.messages]);

    return (
        <div className="flex flex-col h-full bg-gray-900/90 backdrop-blur-xl absolute inset-0 z-20 animate-slideInRight">
            {/* Header */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="text-white hover:text-pink-400"><ArrowLeft size={22}/></button>
                    <span className="text-base font-bold text-white">{char?.name}</span>
                </div>
                <MoreHorizontal className="text-white/70" size={22} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                        {msg.senderId !== 'me' && (
                            <div className="w-9 h-9 rounded-lg overflow-hidden mr-2 shadow-sm flex-shrink-0 border border-white/10">
                                <img src={char?.avatarImage} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm shadow-md leading-relaxed border ${
                            msg.senderId === 'me' ? 'bg-pink-600 text-white border-pink-500' : 'bg-white/10 text-white border-white/10 backdrop-blur-sm'
                        }`}>
                            {msg.type === 'image' ? '[图片]' : msg.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white/5 border-t border-white/10 pb-safe backdrop-blur-md">
                <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
                    {['今晚有空吗？', '纪念日快乐！', '有点想你'].map(txt => (
                        <button key={txt} onClick={() => onSend(txt)} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10 shadow-sm active:scale-95 transition-transform hover:bg-white/20">{txt}</button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white/10"><Mic size={18}/></div>
                    <div className="flex-1 h-9 bg-white/10 rounded-full border border-white/10 flex items-center px-3 text-white/50 text-sm">发送消息...</div>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white/10"><Smile size={18}/></div>
                </div>
            </div>
        </div>
    );
};

const DiaryReader = ({ charId, onClose }: { charId: string, onClose: () => void }) => {
    const entry = DIARIES.find(d => d.charId === charId);
    const char = CHARACTERS.find(c => c.id === charId);

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#FAF7F2] w-full max-w-sm rounded-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh] border-2 border-[#E5E0D5] animate-scaleUp">
                {/* Paper texture stays paper, but modal container is dark glass */}
                <div className="h-32 bg-cover bg-center relative" style={{backgroundImage: `url(${char?.avatarImage})`}}>
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                        <h2 className="text-2xl font-bold text-white font-serif drop-shadow-md">{char?.name}的私密手记</h2>
                    </div>
                    <button onClick={onClose} className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 backdrop-blur-sm"><X size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 relative bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')]">
                    {entry?.isUnlocked ? (
                        <>
                            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                                <span className="font-bold text-lg text-gray-800 font-serif">{entry.title}</span>
                                <span className="text-xs text-gray-500 font-mono">{entry.date}</span>
                            </div>
                            <p className="text-gray-700 leading-8 font-handwriting whitespace-pre-line text-sm animate-fadeIn" style={{animationDelay: '0.2s'}}>
                                {entry.content}
                            </p>
                            <div className="mt-8 text-right opacity-60">
                                <span className="border-2 border-red-800 text-red-800 px-2 py-1 transform -rotate-12 inline-block font-bold text-xs">绝密心事</span>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                            <Lock size={40} />
                            <p className="text-sm font-bold">日记未解锁</p>
                            <p className="text-xs bg-gray-200 px-2 py-1 rounded">{entry?.unlockCondition}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DateSelector = ({ onClose, onSelect }: { onClose: () => void, onSelect: (date: DateScenario) => void }) => {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-gray-900/90 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-slideUp border border-white/10 backdrop-blur-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24} /></button>
                <h2 className="text-xl font-bold text-white mb-1">发起特别约会</h2>
                <p className="text-xs text-pink-400 mb-6">消耗 100 心动值开启专属剧情</p>
                
                <div className="space-y-4">
                    {DATES.map(date => (
                        <div key={date.id} onClick={() => onSelect(date)} className="flex gap-4 p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/50 hover:bg-white/10 transition-all cursor-pointer group active:scale-95">
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                <img src={date.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white/90 mb-1 group-hover:text-pink-400 transition-colors">{date.title}</h3>
                                <div className="flex items-center gap-1 text-[10px] text-white/50 mb-2">
                                    <MapPin size={10} /> {date.location}
                                </div>
                                <p className="text-xs text-white/60 line-clamp-2">{date.desc}</p>
                            </div>
                            <div className="self-center">
                                <ChevronRight className="text-white/30 group-hover:text-pink-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EndingSelector = ({ characters, onClose, onSelect }: { characters: Character[], onClose: () => void, onSelect: (ending: EndingScenario) => void }) => {
    // V6.0 升级：根据心动值动态判断结局可用性
    const getEndingStatus = (ending: EndingScenario) => {
        const char = characters.find(c => c.id === ending.charId);
        if (!char) return 'locked';
        if (char.stats.heartbeat >= ending.requiredHeartbeat) return 'available';
        return 'locked';
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-gray-900/95 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-slideUp my-8 border border-white/10 backdrop-blur-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24} /></button>
                <div className="text-center mb-6">
                    <span className="text-xs font-bold text-pink-500 tracking-widest uppercase">The Final Chapter</span>
                    <h2 className="text-2xl font-bold text-white mt-1">最终选择</h2>
                    <p className="text-xs text-white/40 mt-2">只有心动值达标的结局才能解锁</p>
                </div>
                
                <div className="space-y-3">
                    {ENDINGS.map(end => {
                        const char = characters.find(c => c.id === end.charId);
                        const status = getEndingStatus(end);
                        const isAvailable = status === 'available';
                        const isTrueEnd = end.type === 'True End';
                        const EndingIcon = end.icon;
                        
                        return (
                            <button 
                                key={end.id} 
                                onClick={() => isAvailable && onSelect(end)} 
                                disabled={!isAvailable}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group text-left relative overflow-hidden ${
                                    isAvailable 
                                        ? isTrueEnd ? 'border-pink-500/50 bg-pink-900/20 hover:bg-pink-900/40 hover:border-pink-500' : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        : 'bg-black/40 border-transparent opacity-40 grayscale'
                                }`}
                            >
                                <div className="w-14 h-14 rounded-full bg-black shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white/20 group-hover:scale-105 transition-transform z-10">
                                    <img src={char?.avatarImage} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 z-10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white group-hover:text-pink-400">{end.title}</h3>
                                        {isTrueEnd && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold shadow-lg shadow-red-600/20">True End</span>}
                                    </div>
                                    <p className="text-xs text-white/50 font-mono mt-0.5 mb-1">{end.keyword}</p>
                                    
                                    {/* 达成条件提示 */}
                                    <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded w-fit ${isAvailable ? 'text-pink-300 bg-pink-500/10' : 'text-gray-500 bg-white/5'}`}>
                                        {isAvailable ? (
                                            <>
                                                {isTrueEnd ? <Crown size={10} /> : <Smile size={10} />}
                                                {end.buff}
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={10} />
                                                需心动值 {end.requiredHeartbeat} (当前: {char?.stats.heartbeat})
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-white/20 group-hover:text-pink-500 z-10">
                                    <EndingIcon size={20} />
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const StoryOverlay = ({ option, isDate, onClose }: { option: any, isDate: boolean, onClose: () => void }) => {
    // 使用惰性初始化避免在渲染期间调用 Math.random()
    const [sceneNumber] = useState(() => Math.floor(Math.random() * 9) + 1);
    
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
            {/* Heart Bloom Effect on Show */}
            <HeartBloom />
            
            <div className="bg-gray-900/95 p-3 pb-8 w-full max-w-sm shadow-2xl transform rotate-1 animate-scaleUp relative rounded-lg border border-white/10 backdrop-blur-xl">
                <div className="absolute top-2 left-2 text-[10px] font-mono text-red-500 font-bold z-30 animate-pulse">● REC</div>
                <div className="absolute top-2 right-2 text-[10px] font-mono text-gray-400 font-bold z-30">CAM 01</div>
                
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-white text-black rounded-full p-2 shadow-lg z-20 hover:scale-110 transition-transform"><X size={16}/></button>
                
                {/* Monitor Frame */}
                <div className="relative aspect-[4/5] bg-black mb-4 overflow-hidden shadow-inner border-2 border-gray-800 rounded-lg">
                      <img src={isDate ? option.img : option.avatar} className="w-full h-full object-cover opacity-90" />
                      
                      {/* Viewfinder Overlay */}
                      <div className="absolute inset-0 border-[20px] border-transparent pointer-events-none">
                          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
                          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
                          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
                          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
                          <div className="absolute center w-2 h-2 bg-white/50 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                      </div>

                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                          <div className="flex justify-between items-end">
                              <h3 className="text-xl font-bold font-serif italic">{isDate ? option.title : option.target}</h3>
                              <span className="text-[10px] opacity-80 font-mono tracking-widest">SCENE 0{sceneNumber}</span>
                          </div>
                          <div className="text-xs text-pink-200 mt-1 flex items-center gap-1">
                              <Clapperboard size={12} fill="currentColor" /> {option.cgTitle || option.cg_title || option.keyword}
                          </div>
                      </div>
                </div>

                <div className="px-2">
                      <p className="text-sm text-gray-300 leading-relaxed font-handwriting text-justify mb-4 first-letter:text-2xl first-letter:text-pink-500 first-letter:font-bold">
                          {isDate ? option.story : (option.story_result || option.story)}
                      </p>
                      
                      {/* 结局加成展示 */}
                      {option.buff && (
                          <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-3 flex items-center gap-3 animate-pulse-slow mb-4 backdrop-blur-sm">
                              <div className="bg-pink-500 p-2 rounded-full text-white shadow-lg"><ThumbsUp size={16} /></div>
                              <div className="flex-1">
                                  <h4 className="text-xs font-bold text-pink-300">结局影响判定</h4>
                                  <p className="text-[10px] text-pink-400/80">{option.buff}</p>
                              </div>
                          </div>
                      )}

                      {isDate && (
                          <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-3 flex items-center gap-3 animate-pulse-slow backdrop-blur-sm">
                              <div className="bg-pink-500 p-2 rounded-full text-white shadow-lg"><Gift size={16} /></div>
                              <div className="flex-1">
                                  <h4 className="text-xs font-bold text-pink-300">纪念日：相遇10天</h4>
                                  <p className="text-[10px] text-pink-400/80">已自动归档至美好回忆</p>
                              </div>
                          </div>
                      )}
                </div>
            </div>
        </div>
    );
};

// 新增：StoryDecisionOverlay
// Instagram风格的社交主页组件
interface SocialPost {
    id: string;
    image: string;
    likes: number;
    comments: number;
    caption?: string;
    date: string;
}

// 为每个角色生成示例帖子数据
const generateSocialPosts = (charId: string): SocialPost[] => {
    const baseImages = {
        'lu': [
            'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=400&auto=format&fit=crop',
        ],
        'shen': [
            'https://images.unsplash.com/photo-1614726365723-49cfae927846?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
        ],
        'jiang': [
            'https://images.unsplash.com/photo-1620646233562-f2a31adcc44a?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=400&auto=format&fit=crop',
        ]
    };
    
    const captions = {
        'lu': ['早上的第一杯咖啡', '工作间隙', '周末时光', '思考人生', '记录生活', '心情不错'],
        'shen': ['设计灵感', '午后时光', '生活中的美', '创作日常', '简单生活', '分享瞬间'],
        'jiang': ['训练日常', '充满活力的一天', '运动时光', '正能量', '保持热爱', '阳光正好']
    };
    
    const images = baseImages[charId as keyof typeof baseImages] || baseImages['lu'];
    const postCaptions = captions[charId as keyof typeof captions] || captions['lu'];
    
    // 固定的数据，避免使用Math.random
    const likesData = [1234, 5678, 2345, 3456, 4567, 6789, 3456, 7890, 2345, 5678, 3456, 6789];
    const commentsData = [45, 78, 56, 67, 89, 123, 56, 134, 45, 78, 56, 123];
    const datesData = ['3天前', '5天前', '1周前', '2周前', '3周前', '1个月前', '2周前', '1个月前', '3周前', '1个月前', '2周前', '1个月前'];
    
    return Array.from({ length: 12 }).map((_, i) => ({
        id: `${charId}_post_${i}`,
        image: images[i % images.length],
        likes: likesData[i],
        comments: commentsData[i],
        caption: postCaptions[i % postCaptions.length],
        date: datesData[i]
    }));
};

const InstagramProfileView = ({ char, onClose }: { char: Character, onClose: () => void }) => {
    const [posts] = useState<SocialPost[]>(() => generateSocialPosts(char.id));
    const [activeTab, setActiveTab] = useState<'posts' | 'tagged'>('posts');
    
    // 固定的统计数据，根据角色ID生成
    const stats = useMemo(() => {
        const baseFollowers = { 'lu': 35000, 'shen': 28000, 'jiang': 42000 };
        const baseFollowing = { 'lu': 245, 'shen': 189, 'jiang': 312 };
        return {
            posts: posts.length,
            followers: baseFollowers[char.id as keyof typeof baseFollowers] || 30000,
            following: baseFollowing[char.id as keyof typeof baseFollowing] || 200
        };
    }, [char.id, posts.length]);
    
    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-fadeIn">
            {/* 顶部导航栏 */}
            <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="text-black hover:opacity-70 transition-opacity">
                        <ArrowLeft size={24} />
                    </button>
                    <span className="text-lg font-semibold">{char.name}</span>
                </div>
                <button className="text-black hover:opacity-70 transition-opacity">
                    <MoreHorizontal size={24} />
                </button>
            </div>
            
            {/* 滚动内容 */}
            <div className="flex-1 overflow-y-auto bg-white">
                {/* 用户信息区域 */}
                <div className="px-4 py-6 border-b border-gray-300">
                    <div className="flex items-start gap-4 mb-4">
                        {/* 头像 */}
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                            <img src={char.avatarImage} alt={char.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* 统计信息 */}
                        <div className="flex-1 flex items-center justify-around">
                            <div className="text-center">
                                <div className="text-lg font-semibold">{stats.posts}</div>
                                <div className="text-sm text-gray-600">帖子</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold">{stats.followers.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">粉丝</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold">{stats.following}</div>
                                <div className="text-sm text-gray-600">关注</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 用户名和简介 */}
                    <div className="mb-3">
                        <div className="text-sm font-semibold mb-1">{char.name}</div>
                        <div className="text-sm text-gray-800 mb-1">{char.job}</div>
                        <div className="text-sm text-gray-600 whitespace-pre-line">
                            {char.profile.surface}
                            {'\n'}
                            {char.profile.hobbies.join(' · ')}
                        </div>
                    </div>
                    
                    {/* 关注按钮 */}
                    <button className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors active:scale-98">
                        关注
                    </button>
                </div>
                
                {/* Tab栏 */}
                <div className="flex border-t border-gray-300">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'posts' 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-400'
                        }`}
                    >
                        <Grid size={20} strokeWidth={activeTab === 'posts' ? 2.5 : 1.5} />
                    </button>
                    <button 
                        onClick={() => setActiveTab('tagged')}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'tagged' 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-400'
                        }`}
                    >
                        <UserCheck size={20} strokeWidth={activeTab === 'tagged' ? 2.5 : 1.5} />
                    </button>
                </div>
                
                {/* 帖子网格 */}
                <div className="grid grid-cols-3 gap-px bg-gray-300">
                    {activeTab === 'posts' ? (
                        posts.map(post => (
                            <div 
                                key={post.id} 
                                className="relative aspect-square bg-gray-100 group cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                <img 
                                    src={post.image} 
                                    alt={post.caption} 
                                    className="w-full h-full object-cover"
                                />
                                {/* 悬停显示点赞和评论数 */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                                    <div className="flex items-center gap-2">
                                        <Heart size={20} fill="white" />
                                        <span className="font-semibold">{post.likes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle size={20} fill="white" />
                                        <span className="font-semibold">{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-20 text-center text-gray-400">
                            <UserCheck size={48} className="mx-auto mb-3 opacity-50" />
                            <div className="text-sm">暂无标记的照片</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StoryDecisionOverlay = ({ option, onDecision }: { option: StoryOption, onDecision: (type: 'stay' | 'leave' | 'think') => void }) => {
    return (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-gray-900/90 w-full max-w-sm rounded-3xl shadow-2xl relative overflow-hidden flex flex-col animate-scaleUp border border-white/20 backdrop-blur-xl">
                {/* Header Image */}
                <div className="h-56 relative group">
                    <img src={option.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" />
                    
                    {/* Recording Overlay */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                        <span className="text-white font-mono text-xs font-bold shadow-sm">REC 00:04:21</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg">劇情關鍵點</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 font-serif drop-shadow-md">{option.target}</h3>
                        <p className="text-white/80 text-sm font-medium opacity-90 line-clamp-1">{option.desc}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-transparent flex-1 flex flex-col">
                    <div className="mb-6 flex-1">
                        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <Sparkles size={12} /> 劇情前瞻
                        </h4>
                        <div className="relative">
                            <Quote size={20} className="absolute -top-2 -left-2 text-white/20 transform -scale-x-100" />
                            <p className="text-white/70 text-sm leading-7 font-serif italic bg-white/5 p-4 rounded-xl border border-white/10">
                                {option.intro || option.desc}
                            </p>
                            <Quote size={20} className="absolute -bottom-2 -right-2 text-white/20" />
                        </div>
                    </div>

                    {/* Choices - Game Style Optimized */}
                    <div className="space-y-3 mt-auto">
                        <button 
                            onClick={() => onDecision('stay')}
                            className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-900/50 hover:shadow-pink-600/50 active:scale-95 transition-all flex items-center justify-center gap-2 group border border-white/10"
                        >
                            <Clapperboard size={18} className="group-hover:animate-bounce" /> 
                            <span>Action! (回應信號)</span>
                            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] ml-1">心动 +15</span>
                        </button>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => onDecision('think')}
                                className="flex-1 py-3 bg-white/5 border border-white/10 text-white/70 rounded-xl font-bold text-xs hover:bg-white/10 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-1"
                            >
                                <HelpCircle size={14} /> 猶豫片刻
                            </button>
                            <button 
                                onClick={() => onDecision('leave')}
                                className="flex-1 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl font-bold text-xs hover:bg-white/10 hover:text-white/60 active:scale-95 transition-all flex items-center justify-center gap-1"
                            >
                                <LogOut size={14} /> 保持距離
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 下一个剧情选择器组件 ---
const NextStorySelector = ({ 
    scenario, 
    completedOptionId,
    onSelectOption, 
    onClose 
}: { 
    scenario: StoryScenario, 
    completedOptionId: string,
    onSelectOption: (option: StoryOption) => void,
    onClose: () => void
}) => {
    // 获取其他选项（排除刚完成的）
    const otherOptions = scenario.options.filter(opt => opt.id !== completedOptionId);
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-purple-800/95 rounded-3xl border-2 border-pink-500/30 shadow-2xl overflow-hidden animate-scaleUp">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-400/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                
                {/* 内容 */}
                <div className="relative z-10 p-8">
                    {/* 标题 */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">选择其他角色</h2>
                        <p className="text-white/60 text-sm">探索不同的相遇与对话</p>
                    </div>
                    
                    {/* 选项列表 */}
                    <div className="space-y-3 mb-6">
                        {otherOptions.map((opt) => {
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => onSelectOption(opt)}
                                    className="w-full text-left p-5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 hover:border-pink-400/50 hover:from-pink-600/30 hover:to-purple-600/30 transition-all flex items-center gap-4 group active:scale-[0.98] relative overflow-hidden"
                                >
                                    {/* 背景光效 */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* 头像 */}
                                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/30 group-hover:border-pink-400 transition-colors relative z-10">
                                        <img src={opt.avatar} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"></div>
                                    </div>
                                    
                                    {/* 文本信息 */}
                                    <div className="flex-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-white text-base group-hover:text-pink-200 transition-colors">{opt.label}</h4>
                                        </div>
                                        <p className="text-xs text-white/70 line-clamp-2 group-hover:text-white/90">{opt.desc}</p>
                                    </div>
                                    
                                    {/* 箭头图标 */}
                                    <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={20} className="text-pink-400" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* 关闭按钮 */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                    >
                        稍后选择
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 女主介绍对话组件 ---
const PlayerIntroDialogue = ({ 
    onContinue 
}: { 
    onContinue: () => void;
}) => {
    const [showText, setShowText] = useState(false);
    const [dialogueText, setDialogueText] = useState('');
    const fullText = "大家好，我是新来的嘉宾苏若。刚才谢谢你们帮忙。";
    
    useEffect(() => {
        // 延迟显示对话
        const timer = setTimeout(() => {
            setShowText(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (showText) {
            setDialogueText('');
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < fullText.length) {
                    setDialogueText(fullText.slice(0, charIndex + 1));
                    charIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [showText, fullText]);
    
    const handleClick = () => {
        if (dialogueText !== fullText) {
            // 如果还在打字中，直接显示完整文本
            setDialogueText(fullText);
        } else {
            // 对话完成，继续下一步
            onContinue();
        }
    };
    
    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={handleClick}
        >
            <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-pink-900/95 via-purple-900/95 to-pink-800/95 rounded-3xl border-2 border-pink-500/30 shadow-2xl overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-pink-400/10"></div>
                
                {/* 对话内容 */}
                <div className="relative z-10 p-8">
                    {/* 说话者标识 */}
                    <div className="mb-4">
                        <div className="inline-block px-4 py-2 rounded-full bg-pink-500/30 border border-pink-400/50">
                            <span className="text-pink-200 font-bold text-sm">你（苏若）</span>
                        </div>
                    </div>
                    
                    {/* 对话文本 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <p className="text-white text-lg leading-relaxed font-medium min-h-[60px]">
                            {dialogueText}
                            {dialogueText !== fullText && <span className="animate-pulse">|</span>}
                        </p>
                    </div>
                    
                    {/* 提示 */}
                    <div className="mt-4 text-center">
                        <p className="text-white/50 text-sm">点击继续</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 决策卡片选择界面组件 ---
const DecisionCardSelector = ({ 
    options, 
    onSelectOption, 
    onClose 
}: { 
    options: StoryOption[], 
    onSelectOption: (option: StoryOption) => void,
    onClose: () => void
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-purple-800/95 rounded-3xl border-2 border-pink-500/30 shadow-2xl overflow-hidden animate-scaleUp">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-400/10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                
                {/* 内容 */}
                <div className="relative z-10 p-8">
                    {/* 标题 */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-3">你想趁这个机会，和谁多聊两句？</h2>
                        <p className="text-white/60 text-base">选择你想深入了解的人</p>
                    </div>
                    
                    {/* 决策卡片网格 - 纵向排列（三排） */}
                    <div className="flex flex-col gap-4 mb-6">
                        {options.map((opt, index) => {
                            const character = CHARACTERS.find(c => c.name === opt.target);
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => onSelectOption(opt)}
                                    className="group relative bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 hover:border-pink-400/50 rounded-2xl p-5 hover:from-pink-600/30 hover:to-purple-600/30 transition-all active:scale-[0.98] overflow-hidden flex items-center gap-4"
                                >
                                    {/* 背景光效 */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-pink-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* 头像区域 */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-pink-400 transition-colors relative z-10">
                                            <img src={opt.avatar || character?.avatarImage} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"></div>
                                        </div>
                                        {/* 编号标记 */}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 text-xs font-bold">
                                            {index + 1}
                                        </div>
                                    </div>
                                    
                                    {/* 文本信息 - 横向布局 */}
                                    <div className="relative z-10 flex-1 text-left">
                                        <h4 className="font-bold text-white text-lg mb-1 group-hover:text-pink-200 transition-colors">
                                            {opt.id === 'opt-lu-ep1' ? '陆星辞' : opt.id === 'opt-shen-ep1' ? '沈予' : opt.id === 'opt-jiang-ep1' ? '江哲' : opt.label}
                                        </h4>
                                        <p className="text-sm text-white/70 group-hover:text-white/90">
                                            {opt.id === 'opt-lu-ep1' ? '刚才觉得他很干练' : opt.id === 'opt-shen-ep1' ? '刚才觉得他很贴心' : opt.id === 'opt-jiang-ep1' ? '刚才觉得他很靠谱' : opt.desc}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-pink-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                            <span>选择回应</span>
                                            <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* 提示文字 */}
                    <div className="text-center text-white/50 text-sm mb-4">
                        <p>点击任意卡片开始与TA的对话</p>
                    </div>
                    
                    {/* 关闭按钮 */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                    >
                        稍后选择
                    </button>
                </div>
            </div>
            
            {/* 关闭按钮（右上角） */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
            >
                <X size={20} />
            </button>
        </div>
    );
};

// --- 4. 主 APP 结构 ---

export default function LoveSignalSim() {
  const [activeTab, setActiveTab] = useState<'home' | 'social' | 'message' | 'profile'>('home');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null); 
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [characters, setCharacters] = useState(CHARACTERS);
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const currentScenario = SCENARIOS[currentScenarioIdx];

  const [viewingDiary, setViewingDiary] = useState<string | null>(null);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showEndingSelector, setShowEndingSelector] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeStory, setActiveStory] = useState<{data: any, isDate: boolean} | null>(null);
  const [showHeartBloom, setShowHeartBloom] = useState(false);
  const [expandedCpId, setExpandedCpId] = useState<number | null>(null);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [decisionOption, setDecisionOption] = useState<StoryOption | null>(null);
   
  const [hasNewObservation, setHasNewObservation] = useState(false);
  const [showObservationRoom, setShowObservationRoom] = useState(false);
  const [_showSaveSuccess, setShowSaveSuccess] = useState(false); 
  const [timeCode, setTimeCode] = useState(0); 
  const [hasNewSocialInfo, setHasNewSocialInfo] = useState(false); 
  const [playingOpening, setPlayingOpening] = useState(false);
  
  // New State for Expanded Card
  const [expandedScenario, setExpandedScenario] = useState<StoryScenario | null>(null);
  const [fullScreenStory, setFullScreenStory] = useState<{ scenario: StoryScenario, option: StoryOption | null } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null); // Ref for carousel scrolling
  const prevScenarioIdxRef = useRef<number>(-1); // 跟踪上一次的场景索引
  
  // State for Invitation Card (only for ep1)
  const [showInvitationCard, setShowInvitationCard] = useState(false);
  const [invitationScenario, setInvitationScenario] = useState<StoryScenario | null>(null);
  
  // 欢迎文字显示状态
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  
  // 跟踪已完成的选项，允许用户查看其他角色
  const [completedOptions, setCompletedOptions] = useState<Set<string>>(new Set());
  
  // 下一个剧情选择器状态
  const [showNextStorySelector, setShowNextStorySelector] = useState(false);
  const [nextStorySelectorData, setNextStorySelectorData] = useState<{ scenario: StoryScenario, completedOptionId: string } | null>(null);
  
  // 自动播放对话序列的状态（用于 ep1 等需要连续播放多个选项的场景）
  const [autoPlaySequence, setAutoPlaySequence] = useState<{ scenario: StoryScenario, optionIds: string[], currentIndex: number } | null>(null);
  
  // 决策卡片选择器状态
  const [showDecisionCardSelector, setShowDecisionCardSelector] = useState(false);
  const [decisionCardOptions, setDecisionCardOptions] = useState<StoryOption[]>([]);
  
  // 内心状态对话序列（用于 ep1 回应陆星辞后显示其他两人的内心状态）
  const [_innerThoughtsSequence, setInnerThoughtsSequence] = useState<{ dialogues: Dialogue[], currentIndex: number } | null>(null);
  
  // 待显示的内心状态选项（用于在剧情结果关闭后显示）
  const [pendingInnerThoughtsOption, setPendingInnerThoughtsOption] = useState<{ scenario: StoryScenario, option: StoryOption } | null>(null);
  
  // 女主介绍对话显示状态（用于 ep1 三个对话结束后）
  const [showPlayerIntroDialogue, setShowPlayerIntroDialogue] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatChar = characters.find(c => c.id === activeChat?.charId); 
  const socialData = useMemo(() => {
      return EPISODE_SOCIAL_DATA[currentScenario.id] || EPISODE_SOCIAL_DATA['ep1'];
  }, [currentScenario.id]);

  useEffect(() => {
    const savedData = localStorage.getItem('lovesignal_save_v1');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            setCharacters(parsed.characters);
            setCurrentScenarioIdx(parsed.currentScenarioIdx);
            setChats(parsed.chats);
            // 恢复已完成的选项
            if (parsed.completedOptions && Array.isArray(parsed.completedOptions)) {
                setCompletedOptions(new Set(parsed.completedOptions));
            }
        } catch (e) {
            console.error("Save file corrupted");
        }
    }
    
    const timer = setInterval(() => {
        setTimeCode(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 监听场景变化，更新引用（但不自动触发开屏动画）
  useEffect(() => {
    prevScenarioIdxRef.current = currentScenarioIdx;
  }, [currentScenarioIdx]);

  const formatTimeCode = (seconds: number) => {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}:12`;
  }

  const saveGame = () => {
    const saveData = {
        characters,
        currentScenarioIdx,
        chats,
        completedOptions: Array.from(completedOptions), // Set 转换为数组以便序列化
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('lovesignal_save_v1', JSON.stringify(saveData));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const resetGame = () => {
      if(window.confirm("确定要重置所有进度吗？")) {
          localStorage.removeItem('lovesignal_save_v1');
          window.location.reload();
      }
  }

  const dynamicCpRanking = useMemo(() => {
     // 生成基于 CP ID 的稳定随机偏移量（使用简单的哈希函数）
     const getStableOffset = (id: number): number => {
         // 使用简单的哈希算法生成 0-5000 之间的稳定值
         const hash = id * 7919 % 5000; // 7919 是一个质数
         return hash;
     };
     
     return (socialData.cpRanking || []).map(cp => {
         const char = characters.find(c => c.id === cp.relatedCharId);
         if (char) {
             const dynamicHot = Math.floor(cp.hot + (char.stats.heartbeat * 2000) + getStableOffset(cp.id));
             return { ...cp, hot: dynamicHot };
         }
         return cp;
     }).sort((a, b) => b.hot - a.hot); 
  }, [characters, socialData]);

  const handleChatSend = (txt: string) => { 
      if (!activeChatId) return;
      setChats(prev => prev.map(c => {
          if (c.id === activeChatId) {
              return {
                  ...c,
                  messages: [...c.messages, { id: `me_${Date.now()}`, senderId: 'me', text: txt, type: 'text', time: '刚刚' }]
              };
          }
          return c;
      }));
   };

  // Modified to handle option click from Modal
  const handleOptionClick = (id: string) => { 
      const opt = currentScenario.options.find(o => o.id === id); 
      if(opt) {
          setDecisionOption(opt); 
          setExpandedScenario(null); // Close the detail modal when option selected
      }
  };

  // 处理全屏剧情开始
  const handleStartStory = (option: StoryOption) => {
      const scenario = expandedScenario || currentScenario;
      
      // 如果是 ep1 且还没有开始自动播放序列，初始化序列
      if (scenario.id === 'ep1' && !autoPlaySequence) {
          const optionIds = scenario.options.map(opt => opt.id);
          const currentIndex = optionIds.indexOf(option.id);
          
          // 如果是第一个选项（陆星辞），初始化自动播放序列
          // 这样完成第一个后会自动播放后续选项
          if (currentIndex === 0 && optionIds.length > 1) {
              setAutoPlaySequence({ scenario, optionIds, currentIndex: 0 });
          }
      }
      
      setFullScreenStory({ scenario, option });
  };

  // 处理全屏剧情完成
  const handleStoryComplete = () => {
      if (fullScreenStory?.option) {
          const completedOptionId = fullScreenStory.option.id;
          const scenario = fullScreenStory.scenario;
          
          // 如果是内心状态对话完成，显示剩余两人的选项卡片
          if (completedOptionId.startsWith('inner-thoughts-ep1')) {
              setCompletedOptions(prev => {
                  const newSet = new Set(prev);
                  newSet.add(completedOptionId);
                  return newSet;
              });
              setInnerThoughtsSequence(null);
              setFullScreenStory(null);
              
              // 获取已完成的所有选项（包括内心状态）
              const allCompletedOptions = new Set(completedOptions);
              allCompletedOptions.add(completedOptionId);
              
              // 获取剩余未完成的选项（不包括内心状态）
              const remainingOptions = scenario.options.filter(opt => !allCompletedOptions.has(opt.id));
              
              if (remainingOptions.length > 0) {
                  // 显示剩余选项的决策卡片
                  setDecisionCardOptions(remainingOptions);
                  setShowDecisionCardSelector(true);
              } else {
                  // 所有选项都完成了，解锁下一个章节
                  if (currentScenarioIdx < SCENARIOS.length - 1) {
                      setCurrentScenarioIdx(prev => prev + 1);
                      saveGame();
                  }
              }
              return;
          }
          
          // 标记选项为已完成
          setCompletedOptions(prev => {
              const newSet = new Set(prev);
              newSet.add(completedOptionId);
              return newSet;
          });
          
          // 检查是否在自动播放序列中
          if (autoPlaySequence && autoPlaySequence.scenario.id === scenario.id) {
              // 正在自动播放序列中
              const { scenario: seqScenario, optionIds, currentIndex } = autoPlaySequence;
              
              // 先关闭当前的对话
              setFullScreenStory(null);
              
              if (currentIndex < optionIds.length - 1) {
                  // 还有下一个选项，自动播放
                  const nextOptionId = optionIds[currentIndex + 1];
                  const nextOption = seqScenario.options.find(opt => opt.id === nextOptionId);
                  
                  if (nextOption) {
                      // 更新序列索引
                      setAutoPlaySequence({ scenario: seqScenario, optionIds, currentIndex: currentIndex + 1 });
                      // 延迟一点时间后播放下一个选项
                      setTimeout(() => {
                          setFullScreenStory({ scenario: seqScenario, option: nextOption });
                      }, 500);
                      return; // 不继续执行后面的代码
                  }
              } else {
                  // 所有选项都播放完了
                  setAutoPlaySequence(null);
                  
                  // 如果是 ep1，先显示女主介绍对话
                  if (seqScenario.id === 'ep1') {
                      setShowPlayerIntroDialogue(true);
                  } else {
                      // 其他场景，显示决策卡片选择器
                      if (seqScenario.options.length > 0) {
                          setDecisionCardOptions(seqScenario.options);
                          setShowDecisionCardSelector(true);
                      } else {
                          // 使用第一个选项作为决策选项
                          const firstOption = seqScenario.options[0];
                          if (firstOption) {
                              setDecisionOption(firstOption);
                          }
                      }
                  }
              }
          } else {
              // 不在自动播放序列中，正常处理（显示选择界面或其他）
              // 对于 ep1，如果用户单独选择了某个选项，不自动播放序列
              setFullScreenStory(null);
              handleOptionClick(completedOptionId);
          }
      } else {
          setFullScreenStory(null);
      }
  };
  
  const handleDecision = (type: 'stay' | 'leave' | 'think') => {
      if (!decisionOption) return;
      
      const charName = decisionOption.target;
      const charId = characters.find(c => c.name === charName)?.id;

      // --- V7.3 Feature: EP3 Jiang Zhe Hidden Route ---
      if (currentScenario.id === 'ep3' && charId === 'jiang' && type === 'leave') {
          const hiddenStory = {
              ...decisionOption,
              target: "江哲 · 隱藏劇情",
              avatar: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=800&auto=format&fit=crop", // 雨中撑伞图
              story_result: "你選擇退後半步，避開了這過於熾熱的荷爾蒙場域。\n“那我先回去了。”你轉身走向雨幕。\n\n身後沒有挽留的聲音，只有急促的腳步聲伴隨著水花濺起的聲響。一把黑傘在頭頂撐開，隔絕了漫天大雨。\n\n江哲站在離你一臂之遙的地方，渾身濕透，水珠順著髮梢滴落，眼神卻倔強又溫柔：“我可以不靠近，但不能看著你淋雨。傘給你，我跑回去很快的！”\n\n【觸發隱藏支線：克制的守護者】",
              cg_title: "雨中撐傘 · 隱忍守護",
              buff: "江哲好感度 +50 (觸發隱藏HE關鍵)"
          };

          setCharacters(prev => prev.map(c => {
              if (c.id === 'jiang') {
                  return { ...c, stats: { ...c.stats, heartbeat: c.stats.heartbeat + 50, mood: "守護" } };
              }
              return c;
          }));

          setDecisionOption(null); 
          setShowHeartBloom(true); 
          setTimeout(() => setShowHeartBloom(false), 4000);
          // Show the result immediately
          setActiveStory({data: hiddenStory, isDate: false});
          return;
      }
      // ------------------------------------------------

      if (charId) {
          setCharacters(prev => prev.map(c => {
              if (c.id === charId) {
                  let change = 0;
                  if (type === 'stay') change = 15;
                  if (type === 'leave') change = -5;
                  if (type === 'think') change = 2;
                  return { ...c, stats: { ...c.stats, heartbeat: Math.min(180, Math.max(0, c.stats.heartbeat + change)) } };
              }
              return c;
          }));
      }
      setDecisionOption(null); 
      if (type === 'stay') {
          setShowHeartBloom(true); 
          setTimeout(() => setShowHeartBloom(false), 4000);
          setActiveStory({data: decisionOption, isDate: false});
          
          // 如果是 ep1 且回应了某个角色，显示其他两人的内心状态
          if (currentScenario.id === 'ep1' && (charName === '陆星辞' || charName === '沈予' || charName === '江哲')) {
              let innerThoughts: Dialogue[] = [];
              let innerThoughtsId = '';
              let innerThoughtsTitle = '';
              let innerThoughtsDesc = '';
              let introText = '';
              
              if (charName === '陆星辞') {
                  // 回应陆星辞后，显示沈予和江哲的内心状态
                  innerThoughtsId = 'inner-thoughts-ep1-lu';
                  innerThoughtsTitle = '內心獨白 · 暗流湧動';
                  innerThoughtsDesc = '沈予與江哲的內心獨白';
                  introText = '看著你們的背影消失在玄關...';
                  innerThoughts = [
                      {
                          speaker: 'narrator',
                          text: '看著你們的背影消失在玄關，客廳裡的空氣似乎靜止了。'
                      },
                      {
                          speaker: '沈予',
                          text: '（推了推眼鏡）陸星辭...一如既往地先發制人。',
                          characterId: 'shen',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '沈予的目光在空蕩的門口停留了兩秒，指尖無意識地敲擊著沙發扶手。'
                      },
                      {
                          speaker: '沈予',
                          text: '看來這場遊戲，會比我想像的更有趣。',
                          characterId: 'shen',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '另一邊，江哲靠在牆邊，笑容依舊燦爛，眼神卻多了幾分深意。'
                      },
                      {
                          speaker: '江哲',
                          text: '（輕笑）老陸動作還真快啊...',
                          characterId: 'jiang',
                          emotion: 'normal'
                      },
                      {
                          speaker: '江哲',
                          text: '不過，接下來才是真正的好戲。姐姐，我們很快就會再見的。',
                          characterId: 'jiang',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '別墅的夜晚，才剛剛開始。'
                      }
                  ];
              } else if (charName === '沈予') {
                  // 回应沈予后，显示陆星辞和江哲的内心状态
                  innerThoughtsId = 'inner-thoughts-ep1-shen';
                  innerThoughtsTitle = '內心獨白 · 觀察者的注視';
                  innerThoughtsDesc = '陸星辭與江哲的內心獨白';
                  introText = '看著你們走向二樓，客廳裡的氛圍悄然改變...';
                  innerThoughts = [
                      {
                          speaker: 'narrator',
                          text: '看著你們走向二樓，客廳裡的氛圍悄然改變。'
                      },
                      {
                          speaker: 'narrator',
                          text: '陸星辭放下手中的雜誌，鏡片後的目光追隨著你們的背影，嘴角勾起一抹難以察覺的弧度。'
                      },
                      {
                          speaker: '陆星辞',
                          text: '（低語）沈予...還是那麼謹慎。',
                          characterId: 'lu',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '他輕撫著雜誌的封面，彷彿在思考著什麼。'
                      },
                      {
                          speaker: '陆星辞',
                          text: '不過，這場遊戲才剛剛開始。我會讓你知道，誰才是真正適合你的人。',
                          characterId: 'lu',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '另一邊，江哲收起了笑容，眼神中閃過一絲複雜的情緒。'
                      },
                      {
                          speaker: '江哲',
                          text: '（握緊拳頭）沈予哥...還真是溫柔啊。',
                          characterId: 'jiang',
                          emotion: 'normal'
                      },
                      {
                          speaker: '江哲',
                          text: '但我不會輸的。姐姐，我會用我的方式，讓你看到真正的我。',
                          characterId: 'jiang',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '空氣中瀰漫著一種微妙的張力，彷彿預示著接下來的故事將更加精彩。'
                      },
                      {
                          speaker: 'narrator',
                          text: '別墅的夜晚，暗流湧動。'
                      }
                  ];
              } else if (charName === '江哲') {
                  // 回应江哲后，显示陆星辞和沈予的内心状态
                  innerThoughtsId = 'inner-thoughts-ep1-jiang';
                  innerThoughtsTitle = '內心獨白 · 少年的勝利';
                  innerThoughtsDesc = '陸星辭與沈予的內心獨白';
                  introText = '看著你們歡快的背影，客廳裡的空氣似乎凝結了...';
                  innerThoughts = [
                      {
                          speaker: 'narrator',
                          text: '看著你們歡快的背影，客廳裡的空氣似乎凝結了。'
                      },
                      {
                          speaker: 'narrator',
                          text: '陸星辭輕推眼鏡，目光深沉地注視著你們離去的方向。'
                      },
                      {
                          speaker: '陆星辞',
                          text: '（冷笑）江哲...還真是直球啊。',
                          characterId: 'lu',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '他合上雜誌，指尖輕敲著扶手，眼神中閃過一絲危險的光芒。'
                      },
                      {
                          speaker: '陆星辞',
                          text: '不過，直球也有直球的弱點。我會用更巧妙的方式，贏得你的心。',
                          characterId: 'lu',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '另一邊，沈予沉默不語，手中的咖啡杯輕輕搖晃。'
                      },
                      {
                          speaker: '沈予',
                          text: '（輕嘆）年輕...確實是優勢。',
                          characterId: 'shen',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '他推了推眼鏡，目光中帶著一絲不易察覺的複雜情緒。'
                      },
                      {
                          speaker: '沈予',
                          text: '但成熟和穩重，也有它獨特的魅力。我會證明給你看。',
                          characterId: 'shen',
                          emotion: 'normal'
                      },
                      {
                          speaker: 'narrator',
                          text: '客廳裡的沉默，似乎在訴說著一場無聲的較量。'
                      },
                      {
                          speaker: 'narrator',
                          text: '別墅的夜晚，暗流湧動。'
                      }
                  ];
              }
              
              // 设置内心状态序列
              setInnerThoughtsSequence({ dialogues: innerThoughts, currentIndex: 0 });
              
              // 创建内心状态选项用于 FullScreenStoryView
              const innerThoughtsOption: StoryOption = {
                  id: innerThoughtsId,
                  label: '內心狀態',
                  target: '内心',
                  desc: innerThoughtsDesc,
                  intro: introText,
                  story_result: innerThoughts.map(d => {
                      if (d.speaker === 'narrator') {
                          return d.text;
                      } else {
                          return `"${d.text}"`;
                      }
                  }).join('\n\n'),
                  avatar: currentScenario.coverImage,
                  cg_title: innerThoughtsTitle,
                  dialogues: innerThoughts
              };
              
              // 保存待显示的内心状态，在剧情结果关闭后显示（不自动跳转）
              setPendingInnerThoughtsOption({ scenario: currentScenario, option: innerThoughtsOption });
          }
      } else if (type === 'leave' || type === 'think') {
          // 如果选择保持距离或犹豫，重新显示三个人的决策卡片
          if (currentScenario.id === 'ep1') {
              // 显示所有三个选项的决策卡片
              if (currentScenario.options.length > 0) {
                  setDecisionCardOptions(currentScenario.options);
                  setShowDecisionCardSelector(true);
              }
          }
      }
  };

  const handleDateSelect = (date: DateScenario) => { setShowDateSelector(false); setShowHeartBloom(true); setTimeout(() => setShowHeartBloom(false), 4000); setActiveStory({data: date, isDate: true}); };
  const handleEndingSelect = (ending: EndingScenario) => { setShowEndingSelector(false); setShowHeartBloom(true); setTimeout(() => setShowHeartBloom(false), 4000); setActiveStory({data: ending, isDate: true}); };

  const handleTabChange = (tabId: 'home' | 'social' | 'message' | 'profile') => {
      setActiveTab(tabId);
      if (tabId === 'social') {
          setHasNewSocialInfo(false);
      }
  };

  // Handle Story Overlay Close - 不自动进入下一集，允许用户选择其他角色
  const handleStoryOverlayClose = () => {
      // 标记选项为已完成，允许用户查看其他角色
      if (activeStory?.data?.id && !activeStory.isDate) {
          const completedOptionId = activeStory.data.id;
          const isInnerThoughts = completedOptionId.startsWith('inner-thoughts-ep1');
          
          setCompletedOptions(prev => {
              const newSet = new Set(prev);
              newSet.add(completedOptionId);
              return newSet;
          });
          
          // 如果是内心状态对话完成，显示剩余两人的选项卡片
          if (isInnerThoughts) {
              setInnerThoughtsSequence(null);
              const scenario = currentScenario;
              // 获取已完成的所有选项
              const allCompletedOptions = new Set(completedOptions);
              allCompletedOptions.add(completedOptionId);
              
              // 获取剩余未完成的选项
              const remainingOptions = scenario.options.filter(opt => !allCompletedOptions.has(opt.id));
              
              if (remainingOptions.length > 0) {
                  // 显示剩余选项的决策卡片
                  setDecisionCardOptions(remainingOptions);
                  setShowDecisionCardSelector(true);
              } else {
                  // 所有选项都完成了，解锁下一个章节
                  if (currentScenarioIdx < SCENARIOS.length - 1) {
                      setCurrentScenarioIdx(prev => prev + 1);
                      saveGame();
                  }
              }
              setActiveStory(null);
              return;
          }
          
          // 如果是 ep1 完成了回应（stay），检查是否有待显示的内心状态
          if (currentScenario.id === 'ep1' && completedOptionId.startsWith('opt-')) {
              setActiveStory(null);
              
              // 如果有待显示的内心状态，先显示内心状态
              if (pendingInnerThoughtsOption) {
                  setFullScreenStory({ 
                      scenario: pendingInnerThoughtsOption.scenario, 
                      option: pendingInnerThoughtsOption.option 
                  });
                  setPendingInnerThoughtsOption(null); // 清除待显示状态
                  return; // 不显示决策卡片，先显示内心状态
              }
              
              // 如果没有内心状态，显示剩余两人的选项卡片
              const scenario = currentScenario;
              // 获取已完成的所有选项
              const allCompletedOptions = new Set(completedOptions);
              allCompletedOptions.add(completedOptionId);
              
              // 获取剩余未完成的选项
              const remainingOptions = scenario.options.filter(opt => !allCompletedOptions.has(opt.id));
              
              if (remainingOptions.length > 0) {
                  // 显示剩余选项的决策卡片
                  setDecisionCardOptions(remainingOptions);
                  setShowDecisionCardSelector(true);
              } else {
                  // 所有选项都完成了，解锁下一个章节
                  if (currentScenarioIdx < SCENARIOS.length - 1) {
                      setCurrentScenarioIdx(prev => prev + 1);
                      saveGame();
                  }
              }
              return;
          }
          
          // 检查当前场景是否还有其他选项
          const scenario = currentScenario;
          const otherOptions = scenario.options.filter(opt => opt.id !== completedOptionId);
          
          // 如果有其他选项，显示选择界面
          if (otherOptions.length > 0) {
              setNextStorySelectorData({ scenario, completedOptionId });
              setShowNextStorySelector(true);
          }
      }
      setActiveStory(null);
  };
  
  // 处理下一个剧情选择
  const handleNextStorySelect = (option: StoryOption) => {
      // 关闭选择界面
      setShowNextStorySelector(false);
      setNextStorySelectorData(null);
      
      // 直接开始选中的剧情
      setDecisionOption(option);
  };
  
  // 关闭下一个剧情选择器
  const handleCloseNextStorySelector = () => {
      setShowNextStorySelector(false);
      setNextStorySelectorData(null);
  };
  
  // 处理决策卡片选择
  const handleDecisionCardSelect = (option: StoryOption) => {
      // 关闭决策卡片选择器
      setShowDecisionCardSelector(false);
      setDecisionCardOptions([]);
      
      // 显示该选项的决策界面
      setDecisionOption(option);
  };
  
  // Scroll Helpers
  const scrollLeft = () => {
    if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen sm:min-h-screen bg-gray-900 font-sans selection:bg-pink-200 w-full overflow-hidden">
          <div className="w-full max-w-[430px] h-screen sm:h-[850px] bg-black/30 sm:rounded-[3rem] sm:border-[8px] sm:border-gray-800 sm:shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-white/10 backdrop-blur-3xl safe-area-top safe-area-bottom">
              
              {/* V7.0 Status Bar: Camera Overlay */}
              <div className="h-14 sm:h-16 flex justify-between items-center px-4 sm:px-6 pt-4 text-white z-30 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full pointer-events-none safe-area-top">
                  <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                       <span className="font-mono text-xs font-bold tracking-widest text-red-500">REC</span>
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest opacity-80">{formatTimeCode(timeCode)}</span>
                  <div className="flex items-center gap-2 opacity-80">
                       <span className="text-[10px] font-bold border border-white/50 px-1 rounded">4K</span>
                       <Battery size={14} />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto relative no-scrollbar bg-transparent">
                  {/* Glass Background */}
                  <GlassBackground />

                  {playingOpening && (
                      <EpisodeOpening 
                          scenario={currentScenario} 
                          onFinished={() => {
                              setPlayingOpening(false);
                              // 开屏动画结束后，根据场景ID显示邀请卡片或详情
                              const scenarioToShow = invitationScenario || currentScenario;
                              if (scenarioToShow.id === 'ep1') {
                                  setShowInvitationCard(true);
                              } else {
                                  setExpandedScenario(scenarioToShow);
                              }
                          }} 
                      />
                  )}
                  
                  {/* === TAB: 剧情 (HOME) - TIMELINE VIEW === */}
                  {activeTab === 'home' && (
                    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 pb-24 animate-fadeIn relative z-10 pt-16 sm:pt-20">
                        {/* Header Tools */}
                        <div className="flex justify-between items-center mb-2 px-2">
                            <div className="flex gap-3">
                                <button onClick={() => { setShowObservationRoom(true); setHasNewObservation(false); }} className={`w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full shadow-sm flex items-center justify-center text-purple-400 hover:scale-110 transition-transform ${hasNewObservation ? 'animate-shake' : ''}`}>
                                    <MonitorPlay size={20} />
                                    {hasNewObservation && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>}
                                </button>
                                <button onClick={saveGame} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full shadow-sm flex items-center justify-center text-blue-400 hover:scale-110 transition-transform">
                                    <Save size={20} />
                                </button>
                            </div>
                            
                            <div className="text-center relative">
                                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 tracking-tighter uppercase italic drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] transform -rotate-2">
                                    Love Signal
                                </h1>
                                <div className="text-[9px] bg-white text-black px-1.5 rounded-sm font-bold absolute -right-2 -top-1 transform rotate-12 shadow-sm">
                                    ON AIR
                                </div>
                                <div className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded inline-block mt-1 font-mono border border-white/10 backdrop-blur-sm">SCENE {currentScenarioIdx + 1}</div>
                            </div>
                            
                            <button onClick={resetGame} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-transform">
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        {/* Director's Mission Card - Compact */}
                        <div className="relative group">
                            {/* Animated Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                            
                            {/* Main Card */}
                            <div className="relative bg-gradient-to-br from-gray-900/95 via-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-xl border border-pink-500/30 shadow-lg overflow-hidden">
                                {/* Decorative Pattern */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-xl"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-lg"></div>
                                
                                {/* Content */}
                                <div className="relative p-3">
                                    <div className="flex items-center gap-3">
                                        {/* Icon Container */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg blur-md opacity-50 animate-pulse"></div>
                                            <div className="relative bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center shadow-md shadow-pink-500/50 ring-1 ring-white/20">
                                                <Clapperboard size={18} className="text-white drop-shadow-lg" />
                                            </div>
                                            <Sparkles size={8} className="absolute -top-0.5 -right-0.5 text-yellow-400 animate-pulse" />
                                        </div>
                                        
                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 uppercase tracking-widest">
                                                    导演任务
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50"></div>
                                                    <span className="text-[8px] font-bold text-red-400 uppercase tracking-wider">LIVE</span>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                                                {currentScenario.directorMission || "完成本期心動抉擇"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Container (Horizontal Carousel - Click to Expand) */}
                        <div className="relative group/carousel">
                             {/* Scroll Buttons */}
                             <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0">
                                 <ChevronLeft size={20} />
                             </button>
                             <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0">
                                 <ChevronRight size={20} />
                             </button>

                             <div 
                                ref={carouselRef}
                                className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory no-scrollbar pl-2 scroll-smooth"
                             >
                                 {SCENARIOS.map((scenario, idx) => {
                                    const isCompleted = idx < currentScenarioIdx;
                                    const isCurrent = idx === currentScenarioIdx;
                                    const isLocked = idx > currentScenarioIdx;

                                    return (
                                        <div key={scenario.id} 
                                             className={`flex-shrink-0 w-80 snap-center relative transition-all duration-500 cursor-pointer ${isCurrent ? 'scale-100 opacity-100' : 'scale-95 opacity-60'}`}
                                             onClick={() => {
                                                 if (isLocked) return;
                                                 // 只有点击当前场景时才显示开屏动画
                                                 if (isCurrent) {
                                                     // 保存场景信息，开屏动画结束后使用
                                                     setInvitationScenario(scenario);
                                                     // 显示开屏动画
                                                     setPlayingOpening(true);
                                                 } else {
                                                     // 已完成场景直接显示详情，不需要开屏动画
                                                     if (scenario.id === 'ep1') {
                                                         setInvitationScenario(scenario);
                                                         setShowInvitationCard(true);
                                                     } else {
                                                         setExpandedScenario(scenario);
                                                     }
                                                 }
                                             }}
                                        >
                                            <div className={`absolute top-3 left-3 z-20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                isCompleted ? 'bg-green-500 text-black' : isCurrent ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400'
                                            }`}>
                                                {isCompleted ? 'Replay' : isCurrent ? 'Live' : 'Locked'}
                                            </div>

                                            <div className={`h-[500px] rounded-2xl overflow-hidden relative border-2 ${isCurrent ? 'border-pink-500 shadow-2xl shadow-pink-500/20' : 'border-white/10'} bg-black`}>
                                                <img src={scenario.coverImage} className={`w-full h-full object-cover transition-all duration-700 ${isLocked ? 'blur-sm grayscale' : ''}`} />
                                                
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"></div>

                                                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                                                    <span className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-1 block">Episode {idx + 1}</span>
                                                    <h3 className="text-2xl font-black text-white mb-2 leading-tight italic">{scenario.episodeTitle}</h3>
                                                    <p className="text-sm text-gray-200 line-clamp-3 mb-4 font-light leading-relaxed">
                                                        {isLocked 
                                                            ? (scenario.text.split('\n')[0] + (scenario.text.split('\n')[1] ? ' ' + scenario.text.split('\n')[1] : '') || '劇情尚未解鎖，敬請期待...')
                                                            : scenario.slogan
                                                        }
                                                    </p>
                                                    
                                                    {!isLocked && (
                                                        <div className="w-full py-2.5 bg-white/20 backdrop-blur-sm text-white font-bold text-xs rounded-lg text-center tracking-widest border border-white/20">
                                                            点击查看详情
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {isCurrent && (
                                                <div className="absolute -top-2 -right-2 z-30">
                                                    <div className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg transform rotate-12 border-2 border-white">
                                                        NOW
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                 })}
                            </div>
                        </div>
                    </div>
                  )}

                  {/* === TAB: 圈子 (SOCIAL) === */}
                  {activeTab === 'social' && (
                    <div className="p-4 pb-24 animate-fadeIn relative z-10 pt-16">
                        {/* 熱搜榜 */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Megaphone size={16} className="text-yellow-400 animate-bounce" />
                                <h3 className="font-black text-white text-sm tracking-wide bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase">
                                    Hot Search
                                </h3>
                                <span className="text-[10px] text-white/30 ml-auto font-mono">LIVE UPDATE</span>
                            </div>
                            <div className="space-y-3">
                                {socialData.hotSearches.map((item, i) => (
                                    <div key={item.id} onClick={() => setSelectedTopic({title: item.topic, readCount: item.readCount, discussCount: item.discussCount, posts: item.detailedPosts || []})} className="flex items-center justify-between group cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors border border-transparent hover:border-white/10">
                                        <div className="flex items-center gap-3">
                                            {i < 3 ? (
                                                <div className={`w-5 h-5 flex items-center justify-center rounded-md font-black text-xs ${
                                                    i === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-black shadow-yellow-500/50" : 
                                                    i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-gray-500/50" : 
                                                    "bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-orange-500/50"
                                                } shadow-md`}>
                                                    {i + 1}
                                                </div>
                                            ) : (
                                                <span className={`font-serif italic text-sm font-bold w-5 text-center text-gray-500`}>{item.rank}</span>
                                            )}
                                            <span className={`text-xs font-bold transition-colors ${i < 3 ? 'text-white' : 'text-white/70'} group-hover:text-pink-400`}>{item.topic}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-white/40">{item.discussCount}</span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded text-white font-bold shadow-sm ${
                                                item.tag === '爆' ? 'bg-gradient-to-r from-red-600 to-red-500' : 
                                                item.tag === '沸' ? 'bg-gradient-to-r from-orange-600 to-orange-500' : 
                                                item.tag === '热' ? 'bg-gradient-to-r from-pink-600 to-pink-500' : 
                                                'bg-gradient-to-r from-blue-600 to-blue-500'
                                            }`}>{item.tag}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* CP & Fans sections... */}
                         <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Heart size={16} className="text-pink-500 animate-pulse" />
                                <h3 className="font-black text-white text-sm tracking-wide bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent uppercase">
                                    Best Couple
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {dynamicCpRanking.map((cp, i) => (
                                    <div key={cp.id} className="flex flex-col bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all hover:bg-white/10 group">
                                        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setExpandedCpId(expandedCpId === cp.id ? null : cp.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${i===0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}>{i+1}</div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white/90 block">{cp.name}</span>
                                                    {/* Heat Bar */}
                                                    <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" 
                                                            style={{ width: `${Math.min(100, cp.hot / 6000)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`text-[9px] font-bold flex items-center gap-0.5 ${
                                                    cp.trend === 'up' ? 'text-red-400' : 
                                                    cp.trend === 'down' ? 'text-green-400' : 'text-gray-400'
                                                }`}>
                                                    {cp.trend === 'up' ? <TrendingUp size={10} /> : cp.trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                                                    {Math.floor(cp.hot/1000)}k
                                                </div>
                                                {expandedCpId === cp.id ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                                            </div>
                                        </div>
                                        {expandedCpId === cp.id && (
                                            <div className="px-3 pb-3 space-y-3 animate-fadeIn">
                                                <div className="bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-500/30 relative">
                                                    <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[8px] px-1 rounded shadow-sm">Review</span>
                                                    <div className="flex items-center gap-1.5 mb-1.5 text-indigo-400"><Eye size={10} /><span className="text-[10px] font-bold">觀察室犀利点评</span></div>
                                                    <p className="text-[10px] text-indigo-200 leading-relaxed font-medium">{cp.observerComment}</p>
                                                </div>
                                                <button className="w-full py-2 bg-pink-500/20 text-pink-300 rounded-lg text-xs font-bold mt-2 border border-pink-500/30 hover:bg-pink-500/30 transition-colors flex items-center justify-center gap-1" onClick={() => setSelectedTopic({title: `#${cp.name}# ${cp.desc}`, readCount: cp.superTopic.readCount, discussCount: cp.superTopic.postCount, posts: cp.superTopic.posts, level: cp.superTopic.level})}>
                                                    進入CP超話 <ArrowLeft size={10} className="rotate-180"/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageCircle size={16} className="text-blue-400" />
                                <h3 className="font-black text-white text-sm tracking-wide uppercase">Fan Reactions</h3>
                            </div>
                            <div className="space-y-2">
                                {socialData.fanDiscussions ? socialData.fanDiscussions.map(comment => (
                                    <FanDiscussionItem key={comment.id} comment={comment} />
                                )) : (
                                    <div className="text-center text-xs text-white/30 py-4 flex flex-col items-center gap-2">
                                        <Sticker size={24} className="opacity-50"/>
                                        本期暫無熱評，快去搶沙發吧！
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                  )}

                  {/* === TAB: 消息 (MESSAGE) === */}
                  {activeTab === 'message' && (
                      <div className="flex flex-col h-full bg-transparent animate-fadeIn relative z-10 pt-14">
                          {activeChatId ? (
                              <ChatDetailView chat={activeChat!} char={activeChatChar} onBack={() => setActiveChatId(null)} onSend={handleChatSend} />
                          ) : (
                              <>
                                  <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center shadow-lg sticky top-0 z-10 backdrop-blur-md">
                                      <span className="text-lg font-bold text-white">私麦 (Private Mic)</span>
                                      <MoreHorizontal size={20} className="text-white/50" />
                                  </div>
                                  <div className="p-2 space-y-1">
                                      {chats.map(chat => {
                                          const char = characters.find(c => c.id === chat.charId);
                                          return (
                                              <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl active:bg-white/10 transition-colors cursor-pointer border border-white/5 shadow-sm hover:border-pink-500/30 hover:bg-white/10 backdrop-blur-sm">
                                                  <div className="relative">
                                                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                                                          <img src={char?.avatarImage} className="w-full h-full object-cover" />
                                                      </div>
                                                      {chat.unread > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-black text-white text-[10px] flex items-center justify-center font-bold animate-bounce">{chat.unread}</div>}
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                      <div className="flex justify-between items-center mb-1">
                                                          <h3 className="font-bold text-white/90 text-sm">{char?.name}</h3>
                                                          <span className="text-[10px] text-white/40">{chat.lastTime}</span>
                                                      </div>
                                                      <p className="text-xs text-white/50 truncate">{chat.lastMessage}</p>
                                                  </div>
                                              </div>
                                          )
                                      })}
                                  </div>
                              </>
                          )}
                      </div>
                  )}

                  {/* === TAB: 我的 (PROFILE) === */}
                  {activeTab === 'profile' && (
                      <div className="p-4 pb-24 animate-fadeIn relative z-10 pt-16">
                          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/10 text-center relative overflow-hidden mb-6">
                              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-pink-500/20 to-transparent opacity-50"></div>
                              <div className="absolute top-4 right-4 bg-white/10 p-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors border border-white/10">
                                  <Settings size={16} className="text-white/70" />
                              </div>
                              
                              <div className="relative z-10 mt-2">
                                  <div className="w-24 h-24 mx-auto rounded-full p-1 bg-white/10 shadow-xl mb-3 relative ring-4 ring-white/5 backdrop-blur-sm">
                                      <img src={PROTAGONIST.avatar} className="w-full h-full rounded-full object-cover" />
                                      <div className="absolute bottom-1 right-1 bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white/20 font-bold flex items-center gap-1 shadow-lg">
                                         <Sparkles size={8} /> Lv.3
                                      </div>
                                  </div>
                                  
                                  <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-1 drop-shadow-md">
                                      {PROTAGONIST.name} 
                                      <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">{PROTAGONIST.constellation}</span>
                                  </h2>
                                  
                                  <p className="text-xs text-white/50 mb-4 flex items-center justify-center gap-2">
                                      <span>{PROTAGONIST.job}</span>
                                      <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                      <span>入住第{PROTAGONIST.daysInHouse}天</span>
                                  </p>
                                  
                                  <button onClick={() => setShowCalendar(true)} className="w-full flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg border border-white/10 hover:bg-white/20 transition-all active:scale-95 mb-6 backdrop-blur-md">
                                      <BookHeart size={16} /> 查看通告表 (Calendar)
                                  </button>
                                  
                                  <div className="grid grid-cols-3 gap-3 mb-2">
                                        <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 flex flex-col items-center backdrop-blur-sm">
                                            <span className="text-xs text-orange-300 font-bold mb-1">人氣值</span>
                                            <span className="text-lg font-black text-white">{PROTAGONIST.currency}</span>
                                        </div>
                                        <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 flex flex-col items-center backdrop-blur-sm">
                                            <span className="text-xs text-purple-300 font-bold mb-1">收集櫃</span>
                                            <span className="text-lg font-black text-white">{PROTAGONIST.collectedCGs}</span>
                                        </div>
                                         <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20 flex flex-col items-center backdrop-blur-sm">
                                            <span className="text-xs text-blue-300 font-bold mb-1">人設</span>
                                            <span className="text-lg font-black text-white text-[14px] leading-7">{PROTAGONIST.mood}</span>
                                        </div>
                                  </div>
                              </div>
                          </div>

                          <h3 className="text-sm font-bold text-white/40 mb-3 uppercase tracking-wider px-1">嘉賓狀態監控</h3>
                          <div className="space-y-3">
                              {characters.map(char => (
                                  <MaleLeadStatusCard key={char.id} char={char} onOpenDiary={setViewingDiary} onOpenProfile={setViewingProfile} />
                              ))}
                          </div>
                      </div>
                  )}

              </div>

          {/* Bottom Navigation - Studio Style with Glass */}
          {!activeChatId && !selectedTopic && (
              <div className="h-[80px] bg-black/60 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-2 pb-4 absolute bottom-0 w-full z-40">
                  {[
                      { id: 'home', icon: Clapperboard, label: '現場 (Set)' },
                      { id: 'social', icon: Radio, label: '信號 (Air)', hasDot: hasNewSocialInfo },
                      { id: 'message', icon: MessageCircle, label: '私麥 (Mic)', badge: 3 },
                      { id: 'profile', icon: User, label: '嘉賓 (Cast)' },
                  ].map(tab => (
                      <button 
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id as any)}
                          className={`flex flex-col items-center gap-1 p-2 w-16 transition-all ${activeTab === tab.id ? 'text-pink-400 scale-105' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                          <div className="relative">
                              <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} className={activeTab === tab.id ? 'drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]' : ''} />
                              {tab.badge && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full border-2 border-black text-[9px] flex items-center justify-center text-white shadow-lg">{tab.badge}</span>}
                              {tab.hasDot && <span className="absolute -top-0 -right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>}
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                      </button>
                  ))}
              </div>
          )}

          {/* Modals & Overlays */}
          {showInvitationCard && invitationScenario && (
              <InvitationCard 
                  scenario={invitationScenario}
                  onConfirm={() => {
                      setShowInvitationCard(false);
                      // 先显示欢迎文字
                      setShowWelcomeText(true);
                  }}
              />
          )}
          
          {showWelcomeText && invitationScenario && (
              <WelcomeText 
                  onContinue={() => {
                      setShowWelcomeText(false);
                      setExpandedScenario(invitationScenario);
                      setInvitationScenario(null);
                  }}
              />
          )}

          {showPlayerIntroDialogue && (
              <PlayerIntroDialogue 
                  onContinue={() => {
                      setShowPlayerIntroDialogue(false);
                      // 显示三个决策卡片供玩家选择
                      const currentScenario = SCENARIOS.find(s => s.id === 'ep1');
                      if (currentScenario && currentScenario.options.length > 0) {
                          setDecisionCardOptions(currentScenario.options);
                          setShowDecisionCardSelector(true);
                      }
                  }}
              />
          )}

          {fullScreenStory && (
              <FullScreenStoryView
                  scenario={fullScreenStory.scenario}
                  option={fullScreenStory.option}
                  onClose={() => setFullScreenStory(null)}
                  onComplete={handleStoryComplete}
              />
          )}

          {expandedScenario && !fullScreenStory && (
              <EpisodeDetailModal 
                scenario={expandedScenario} 
                onClose={() => setExpandedScenario(null)} 
                onOptionClick={handleOptionClick}
                onStartStory={handleStartStory}
                isCurrent={expandedScenario.id === currentScenario.id}
                isCompleted={SCENARIOS.findIndex(s => s.id === expandedScenario.id) < currentScenarioIdx}
                isLocked={SCENARIOS.findIndex(s => s.id === expandedScenario.id) > currentScenarioIdx}
                completedOptions={completedOptions}
              />
          )}

          {showObservationRoom && socialData.observerDiscussion && <ObservationRoomModal posts={socialData.observerDiscussion} onClose={() => setShowObservationRoom(false)} />}
          {decisionOption && <StoryDecisionOverlay option={decisionOption} onDecision={handleDecision} />}
          {selectedTopic && <WeiboDetailView topic={selectedTopic} onBack={() => setSelectedTopic(null)} />}
          {showCalendar && <CalendarView onClose={() => setShowCalendar(false)} />}
          {viewingDiary && <DiaryReader charId={viewingDiary} onClose={() => setViewingDiary(null)} />}
          {viewingProfile && <InstagramProfileView char={CHARACTERS.find(c => c.id === viewingProfile)!} onClose={() => setViewingProfile(null)} />}
          {showDateSelector && <DateSelector onClose={() => setShowDateSelector(false)} onSelect={handleDateSelect} />}
          {showEndingSelector && <EndingSelector characters={characters} onClose={() => setShowEndingSelector(false)} onSelect={handleEndingSelect} />}
          {activeStory && <StoryOverlay option={activeStory.data} isDate={activeStory.isDate} onClose={() => handleStoryOverlayClose()} />}
          {showNextStorySelector && nextStorySelectorData && (
              <NextStorySelector 
                  scenario={nextStorySelectorData.scenario}
                  completedOptionId={nextStorySelectorData.completedOptionId}
                  onSelectOption={handleNextStorySelect}
                  onClose={handleCloseNextStorySelector}
              />
          )}
          {showDecisionCardSelector && decisionCardOptions.length > 0 && (
              <DecisionCardSelector 
                  options={decisionCardOptions}
                  onSelectOption={handleDecisionCardSelect}
                  onClose={() => {
                      setShowDecisionCardSelector(false);
                      setDecisionCardOptions([]);
                      
                      // 如果有关闭决策卡片选择器时，检查是否有待显示的内心状态
                      if (pendingInnerThoughtsOption) {
                          // 延迟一点时间后显示内心状态，让玩家有时间看清关闭效果
                          setTimeout(() => {
                              setFullScreenStory({ 
                                  scenario: pendingInnerThoughtsOption.scenario, 
                                  option: pendingInnerThoughtsOption.option 
                              });
                              setPendingInnerThoughtsOption(null);
                          }, 300);
                      }
                  }}
              />
          )}
          {showHeartBloom && <HeartBloom />}
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
        .font-handwriting { font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes floatUp { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-100px) scale(1); opacity: 0; } }
        .animate-floatUp { animation-name: floatUp; animation-timing-function: ease-out; animation-fill-mode: forwards; }
        @keyframes bounceShort { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-bounce-short { animation: bounceShort 0.3s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
        @keyframes slideLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-300%); }
        }
        .animate-slideLeft { animation: slideLeft linear infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-glitch { animation: glitch 1s linear infinite; }
        @keyframes glitch {
          2%, 64% { transform: translate(2px,0) skew(0deg); }
          4%, 60% { transform: translate(-2px,0) skew(0deg); }
          62% { transform: translate(0,0) skew(5deg); }
        }
        .animate-zoomIn { animation: zoomIn 10s linear infinite alternate; }
        @keyframes zoomIn {
           0% { transform: scale(1); }
           100% { transform: scale(1.1); }
        }
        .animate-scanline { animation: scanline 2s linear infinite; }
        @keyframes scanline {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-slideDown { animation: slideDown 0.5s ease-out forwards; }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.8; }
            100% { transform: translateY(-60px) translateX(30px) scale(0.8); opacity: 0.2; }
        }
        @keyframes pulseGlow {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}