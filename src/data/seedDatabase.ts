import { VocabWord } from '../types/hsk';

export const initialVocabDatabase: VocabWord[] = [
  // ==========================================
  // HSK 1 VOCABULARY (A-Z)
  // ==========================================
  {
    id: 'hsk1_a_001',
    hskLevel: 1,
    pinyinLetter: 'A',
    pinyinSortKey: 'ai',
    hanzi: '爱',
    pinyin: 'ài',
    thaiMeaning: 'รัก, ชอบ',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '我爱学中文。',
      pinyin: 'Wǒ ài xué zhōngwén.',
      thai: 'ฉันชอบเรียนภาษาจีน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_x_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำใกล้เคียง'
      }
    ]
  },
  {
    id: 'hsk1_b_001',
    hskLevel: 1,
    pinyinLetter: 'B',
    pinyinSortKey: 'ba',
    hanzi: '八',
    pinyin: 'bā',
    thaiMeaning: 'แปด (เลข 8)',
    partOfSpeech: 'คำบอกจำนวน',
    example: {
      hanzi: '他有八本书。',
      pinyin: 'Tā yǒu bā běn shū.',
      thai: 'เขามีหนังสือแปดเล่ม'
    },
    relatedWords: []
  },
  {
    id: 'hsk1_b_002',
    hskLevel: 1,
    pinyinLetter: 'B',
    pinyinSortKey: 'bu',
    hanzi: '不',
    pinyin: 'bù',
    thaiMeaning: 'ไม่',
    partOfSpeech: 'คำวิเศษณ์ปฏิเสธ',
    example: {
      hanzi: '我不是老师。',
      pinyin: 'Wǒ bú shì lǎoshī.',
      thai: 'ฉันไม่ใช่คุณครู'
    },
    relatedWords: []
  },
  {
    id: 'hsk1_d_001',
    hskLevel: 1,
    pinyinLetter: 'D',
    pinyinSortKey: 'da',
    hanzi: '大',
    pinyin: 'dà',
    thaiMeaning: 'ใหญ่, โต',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这个苹果很大。',
      pinyin: 'Zhège píngguǒ hěn dà.',
      thai: 'แอปเปิ้ลลูกนี้ใหญ่มาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_x_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (เล็ก)'
      }
    ]
  },
  {
    id: 'hsk1_d_002',
    hskLevel: 1,
    pinyinLetter: 'D',
    pinyinSortKey: 'duo',
    hanzi: '多',
    pinyin: 'duō',
    thaiMeaning: 'มาก, เยอะ',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这里的人很多。',
      pinyin: 'Zhèlǐ de rén hěn duō.',
      thai: 'คนที่นี่เยอะมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_s_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (น้อย)'
      }
    ]
  },
  {
    id: 'hsk1_g_001',
    hskLevel: 1,
    pinyinLetter: 'G',
    pinyinSortKey: 'gaoxing',
    hanzi: '高兴',
    pinyin: 'gāoxìng',
    thaiMeaning: 'ดีใจ, มีความสุข',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '认识你很高兴。',
      pinyin: 'Rènshi nǐ hěn gāoxìng.',
      thai: 'ยินดีที่ได้รู้จักคุณ'
    },
    relatedWords: []
  },
  {
    id: 'hsk1_h_001',
    hskLevel: 1,
    pinyinLetter: 'H',
    pinyinSortKey: 'hao',
    hanzi: '好',
    pinyin: 'hǎo',
    thaiMeaning: 'ดี, สบายดี',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '今天天气很好。',
      pinyin: 'Jīntiān tiānqì hěn hǎo.',
      thai: 'วันนี้อากาศดีมาก'
    },
    relatedWords: []
  },
  {
    id: 'hsk1_k_001',
    hskLevel: 1,
    pinyinLetter: 'K',
    pinyinSortKey: 'kai',
    hanzi: '开',
    pinyin: 'kāi',
    thaiMeaning: 'เปิด, ขับ (รถ)',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '请开门。',
      pinyin: 'Qǐng kāi mén.',
      thai: 'กรุณาเปิดประตู'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_g_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ปิด)'
      }
    ]
  },
  {
    id: 'hsk1_g_002',
    hskLevel: 1,
    pinyinLetter: 'G',
    pinyinSortKey: 'guan',
    hanzi: '关',
    pinyin: 'guān',
    thaiMeaning: 'ปิด, ดับ',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '请关上窗户。',
      pinyin: 'Qǐng guān shàng chuānghu.',
      thai: 'กรุณาปิดหน้าต่าง'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_k_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (เปิด)'
      }
    ]
  },
  {
    id: 'hsk1_l_001',
    hskLevel: 1,
    pinyinLetter: 'L',
    pinyinSortKey: 'lai',
    hanzi: '来',
    pinyin: 'lái',
    thaiMeaning: 'มา',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '他明天来我家。',
      pinyin: 'Tā míngtiān lái wǒ jiā.',
      thai: 'พรุ่งนี้เขาจะมาบ้านฉัน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_q_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ไป)'
      }
    ]
  },
  {
    id: 'hsk1_l_002',
    hskLevel: 1,
    pinyinLetter: 'L',
    pinyinSortKey: 'leng',
    hanzi: '冷',
    pinyin: 'lěng',
    thaiMeaning: 'หนาว, เย็น',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '今天太冷了。',
      pinyin: 'Jīntiān tài lěng le.',
      thai: 'วันนี้หนาวเกินไปแล้ว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_r_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ร้อน)'
      }
    ]
  },
  {
    id: 'hsk1_m_001',
    hskLevel: 1,
    pinyinLetter: 'M',
    pinyinSortKey: 'mai',
    hanzi: '买',
    pinyin: 'mǎi',
    thaiMeaning: 'ซื้อ',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '我想买一点儿水果。',
      pinyin: 'Wǒ xiǎng mǎi yìdiǎnr shuǐguǒ.',
      thai: 'ฉันอยากซื้อผลไม้นิดหน่อย'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_m_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ขาย)'
      }
    ]
  },
  {
    id: 'hsk1_q_001',
    hskLevel: 1,
    pinyinLetter: 'Q',
    pinyinSortKey: 'qu',
    hanzi: '去',
    pinyin: 'qù',
    thaiMeaning: 'ไป',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '我们要去学校。',
      pinyin: 'Wǒmen yào qù xuéxiào.',
      thai: 'พวกเราจะไปโรงเรียน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_l_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (มา)'
      }
    ]
  },
  {
    id: 'hsk1_r_001',
    hskLevel: 1,
    pinyinLetter: 'R',
    pinyinSortKey: 're',
    hanzi: '热',
    pinyin: 'rè',
    thaiMeaning: 'ร้อน',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '夏天非常热。',
      pinyin: 'Xiàtiān fēicháng rè.',
      thai: 'ฤดูร้อน ร้อนมากๆ'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_l_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (หนาว)'
      }
    ]
  },
  {
    id: 'hsk1_s_001',
    hskLevel: 1,
    pinyinLetter: 'S',
    pinyinSortKey: 'shao',
    hanzi: '少',
    pinyin: 'shǎo',
    thaiMeaning: 'น้อย',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '杯子里的水很少。',
      pinyin: 'Bēizi lǐ de shuǐ hěn shǎo.',
      thai: 'น้ำในแก้วน้อยมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_d_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (มาก)'
      }
    ]
  },
  {
    id: 'hsk1_s_002',
    hskLevel: 1,
    pinyinLetter: 'S',
    pinyinSortKey: 'shang',
    hanzi: '上',
    pinyin: 'shàng',
    thaiMeaning: 'บน, ขึ้น',
    partOfSpeech: 'คำนามบอกทิศทาง/กริยา',
    example: {
      hanzi: '桌子上有一本书。',
      pinyin: 'Zhuōzi shang yǒu yì běn shū.',
      thai: 'บนโต๊ะมีหนังสือหนึ่งเล่ม'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_z_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลตำแหน่ง (กลาง)'
      },
      {
        targetWordId: 'hsk1_x_003',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลตำแหน่ง (ล่าง)'
      }
    ]
  },
  {
    id: 'hsk1_x_001',
    hskLevel: 1,
    pinyinLetter: 'X',
    pinyinSortKey: 'xihuan',
    hanzi: '喜欢',
    pinyin: 'xǐhuan',
    thaiMeaning: 'ชอบ, พอใจ',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '我很喜欢吃米饭。',
      pinyin: 'Wǒ hěn xǐhuan chī mǐfàn.',
      thai: 'ฉันชอบกินข้าวสวยมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_a_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำใกล้เคียง'
      }
    ]
  },
  {
    id: 'hsk1_x_002',
    hskLevel: 1,
    pinyinLetter: 'X',
    pinyinSortKey: 'xiao',
    hanzi: '小',
    pinyin: 'xiǎo',
    thaiMeaning: 'เล็ก, น้อย',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这只小猫真可爱。',
      pinyin: 'Zhè zhī xiǎomāo zhēn kě’ài.',
      thai: 'ลูกแมวตัวนี้น่ารักจริงๆ'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_d_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ใหญ่)'
      }
    ]
  },
  {
    id: 'hsk1_x_003',
    hskLevel: 1,
    pinyinLetter: 'X',
    pinyinSortKey: 'xia',
    hanzi: '下',
    pinyin: 'xià',
    thaiMeaning: 'ล่าง, ลง',
    partOfSpeech: 'คำนามบอกทิศทาง/กริยา',
    example: {
      hanzi: '椅子下面有一只狗。',
      pinyin: 'Yǐzi xiàmiàn yǒu yì zhī gǒu.',
      thai: 'ใต้เก้าอี้มีหมาหนึ่งตัว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_s_002',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลตำแหน่ง (บน)'
      },
      {
        targetWordId: 'hsk1_z_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลตำแหน่ง (กลาง)'
      }
    ]
  },
  {
    id: 'hsk1_y_001',
    hskLevel: 1,
    pinyinLetter: 'Y',
    pinyinSortKey: 'you',
    hanzi: '右',
    pinyin: 'yòu',
    thaiMeaning: 'ขวา, ด้านขวา',
    partOfSpeech: 'คำนามบอกตำแหน่ง',
    example: {
      hanzi: '医院在超市的右边。',
      pinyin: 'Yīyuàn zài chāoshì de yòubian.',
      thai: 'โรงพยาบาลอยู่ทางด้านขวาของซูเปอร์มาร์เก็ต'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_z_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ซ้าย)'
      }
    ]
  },
  {
    id: 'hsk1_z_001',
    hskLevel: 1,
    pinyinLetter: 'Z',
    pinyinSortKey: 'zhong',
    hanzi: '中',
    pinyin: 'zhōng',
    thaiMeaning: 'กลาง, ตรงกลาง',
    partOfSpeech: 'คำนามบอกตำแหน่ง',
    example: {
      hanzi: '他在我们中间。',
      pinyin: 'Tā zài wǒmen zhōngjiān.',
      thai: 'เขาอยู่ท่ามกลางพวกเรา'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_s_002',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลตำแหน่ง (บน)'
      },
      {
        targetWordId: 'hsk1_x_003',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลตำแหน่ง (ล่าง)'
      }
    ]
  },
  {
    id: 'hsk1_z_002',
    hskLevel: 1,
    pinyinLetter: 'Z',
    pinyinSortKey: 'zuo',
    hanzi: '左',
    pinyin: 'zuǒ',
    thaiMeaning: 'ซ้าย, ด้านซ้าย',
    partOfSpeech: 'คำนามบอกตำแหน่ง',
    example: {
      hanzi: '往左走就是车站。',
      pinyin: 'Wǎng zuǒ zǒu jiù shì chēzhàn.',
      thai: 'เดินไปทางซ้ายก็คือสถานีรถ'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_y_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ขวา)'
      }
    ]
  },

  // ==========================================
  // HSK 2 VOCABULARY (A-Z)
  // ==========================================
  {
    id: 'hsk2_b_001',
    hskLevel: 2,
    pinyinLetter: 'B',
    pinyinSortKey: 'baise',
    hanzi: '白',
    pinyin: 'bái',
    thaiMeaning: 'ขาว, สีขาว',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '她穿了一件白色的衣服。',
      pinyin: 'Tā chuān le yí jiàn báisè de yīfu.',
      thai: 'เธอสวมเสื้อผ้าสีขาวหนึ่งตัว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_h_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ดำ)'
      }
    ]
  },
  {
    id: 'hsk2_c_001',
    hskLevel: 2,
    pinyinLetter: 'C',
    pinyinSortKey: 'chuan',
    hanzi: '穿',
    pinyin: 'chuān',
    thaiMeaning: 'สวม, ใส่',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '今天冷，多穿一点儿。',
      pinyin: 'Jīntiān lěng, duō chuān yìdiǎnr.',
      thai: 'วันนี้หนาว สวมเสื้อผ้าหนาๆ หน่อย'
    },
    relatedWords: []
  },
  {
    id: 'hsk2_d_001',
    hskLevel: 2,
    pinyinLetter: 'D',
    pinyinSortKey: 'dan',
    hanzi: '但是',
    pinyin: 'dànshì',
    thaiMeaning: 'แต่, แต่ทว่า',
    partOfSpeech: 'คำสันธาน',
    example: {
      hanzi: '虽然很累，但是很开心。',
      pinyin: 'Suīrán hěn lèi, dànshì hěn kāixīn.',
      thai: 'ถึงแม้เหนื่อยมาก แต่ก็มีความสุขมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_s_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำคู่ไวยากรณ์ (แม้ว่า...แต่...)'
      }
    ]
  },
  {
    id: 'hsk2_d_002',
    hskLevel: 2,
    pinyinLetter: 'D',
    pinyinSortKey: 'dong',
    hanzi: '懂',
    pinyin: 'dǒng',
    thaiMeaning: 'เข้าใจ, รู้เรื่อง',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '老师说的话我都懂了。',
      pinyin: 'Lǎoshī shuō de huà wǒ dōu dǒng le.',
      thai: 'คำที่คุณครูพูดฉันเข้าใจทั้งหมดแล้ว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_m_002',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำใกล้เคียง (明白)'
      }
    ]
  },
  {
    id: 'hsk2_g_001',
    hskLevel: 2,
    pinyinLetter: 'G',
    pinyinSortKey: 'gao',
    hanzi: '高',
    pinyin: 'gāo',
    thaiMeaning: 'สูง',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '哥哥比我高。',
      pinyin: 'Gēge bǐ wǒ gāo.',
      thai: 'พี่ชายสูงกว่าฉัน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_z_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลระดับ (กลาง)'
      },
      {
        targetWordId: 'hsk3_d_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลระดับ (ต่ำ)'
      }
    ]
  },
  {
    id: 'hsk2_g_002',
    hskLevel: 2,
    pinyinLetter: 'G',
    pinyinSortKey: 'gui',
    hanzi: '贵',
    pinyin: 'guì',
    thaiMeaning: 'แพง',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这件衣服太贵了。',
      pinyin: 'Zhè jiàn yīfu tài guì le.',
      thai: 'เสื้อตัวนี้แพงเกินไปแล้ว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_p_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ถูก)'
      }
    ]
  },
  {
    id: 'hsk2_h_001',
    hskLevel: 2,
    pinyinLetter: 'H',
    pinyinSortKey: 'hei',
    hanzi: '黑',
    pinyin: 'hēi',
    thaiMeaning: 'ดำ, สีดำ, มืด',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '天已经黑了。',
      pinyin: 'Tiān yǐjīng hēi le.',
      thai: 'ท้องฟ้ามืดแล้ว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_b_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ขาว)'
      }
    ]
  },
  {
    id: 'hsk2_h_002',
    hskLevel: 2,
    pinyinLetter: 'H',
    pinyinSortKey: 'hou',
    hanzi: '后',
    pinyin: 'hòu',
    thaiMeaning: 'หลัง, ข้างหลัง',
    partOfSpeech: 'คำนามบอกทิศทาง',
    example: {
      hanzi: '他坐在我的后面。',
      pinyin: 'Tā zuò zài wǒ de hòumiàn.',
      thai: 'เขานั่งอยู่ข้างหลังฉัน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_q_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (หน้า)'
      }
    ]
  },
  {
    id: 'hsk2_j_001',
    hskLevel: 2,
    pinyinLetter: 'J',
    pinyinSortKey: 'jin',
    hanzi: '进',
    pinyin: 'jìn',
    thaiMeaning: 'เข้า',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '请大家进教室。',
      pinyin: 'Qǐng dàjiā jìn jiàoshì.',
      thai: 'ขอให้ทุกคนเข้าห้องเรียน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_c_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ออก)'
      }
    ]
  },
  {
    id: 'hsk2_c_002',
    hskLevel: 2,
    pinyinLetter: 'C',
    pinyinSortKey: 'chu',
    hanzi: '出',
    pinyin: 'chū',
    thaiMeaning: 'ออก',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '他走出了房间。',
      pinyin: 'Tā zǒu chū le fángjiān.',
      thai: 'เขาเดินออกจากห้องแล้ว'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_j_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (เข้า)'
      }
    ]
  },
  {
    id: 'hsk2_k_001',
    hskLevel: 2,
    pinyinLetter: 'K',
    pinyinSortKey: 'kuai',
    hanzi: '快',
    pinyin: 'kuài',
    thaiMeaning: 'เร็ว, ไว',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这列火车开得真快。',
      pinyin: 'Zhè liè huǒchē kāi de zhēn kuài.',
      thai: 'รถไฟขบวนนี้วิ่งเร็วมากจริงๆ'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_m_003',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ช้า)'
      }
    ]
  },
  {
    id: 'hsk2_m_001',
    hskLevel: 2,
    pinyinLetter: 'M',
    pinyinSortKey: 'mai',
    hanzi: '卖',
    pinyin: 'mài',
    thaiMeaning: 'ขาย',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '这家商店卖面包。',
      pinyin: 'Zhè jiā shāngdiàn mài miànbāo.',
      thai: 'ร้านค้าร้านนี้ขายขนมปัง'
    },
    relatedWords: [
      {
        targetWordId: 'hsk1_m_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ซื้อ)'
      }
    ]
  },
  {
    id: 'hsk2_m_002',
    hskLevel: 2,
    pinyinLetter: 'M',
    pinyinSortKey: 'mingbai',
    hanzi: '明白',
    pinyin: 'míngbai',
    thaiMeaning: 'เข้าใจ, กระจ่าง',
    partOfSpeech: 'คำกริยา/คุณศัพท์',
    example: {
      hanzi: '你明白我的意思吗？',
      pinyin: 'Nǐ míngbai wǒ de yìsi ma?',
      thai: 'คุณเข้าใจความหมายของฉันไหม'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_d_002',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำใกล้เคียง (懂)'
      }
    ]
  },
  {
    id: 'hsk2_m_003',
    hskLevel: 2,
    pinyinLetter: 'M',
    pinyinSortKey: 'man',
    hanzi: '慢',
    pinyin: 'màn',
    thaiMeaning: 'ช้า',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '请说得慢一点儿。',
      pinyin: 'Qǐng shuō de màn yìdiǎnr.',
      thai: 'กรุณาพูดช้าลงหน่อย'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_k_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (เร็ว)'
      }
    ]
  },
  {
    id: 'hsk2_p_001',
    hskLevel: 2,
    pinyinLetter: 'P',
    pinyinSortKey: 'pianyi',
    hanzi: '便宜',
    pinyin: 'piányi',
    thaiMeaning: 'ถูก, ราคาถูก',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这件衣服很便宜。',
      pinyin: 'Zhè jiàn yīfu hěn piányi.',
      thai: 'เสื้อผ้าตัวนี้ราคาถูกมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_g_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (แพง)'
      }
    ]
  },
  {
    id: 'hsk2_q_001',
    hskLevel: 2,
    pinyinLetter: 'Q',
    pinyinSortKey: 'qian',
    hanzi: '前',
    pinyin: 'qián',
    thaiMeaning: 'หน้า, ด้านหน้า',
    partOfSpeech: 'คำนามบอกทิศทาง',
    example: {
      hanzi: '我家前面有一个公园。',
      pinyin: 'Wǒ jiā qiánmiàn yǒu yí gè gōngyuán.',
      thai: 'ข้างหน้าบ้านฉันมีสวนสาธารณะแห่งหนึ่ง'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_h_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (หลัง)'
      }
    ]
  },
  {
    id: 'hsk2_s_001',
    hskLevel: 2,
    pinyinLetter: 'S',
    pinyinSortKey: 'suiran',
    hanzi: '虽然',
    pinyin: 'suīrán',
    thaiMeaning: 'แม้ว่า, ถึงแม้ว่า',
    partOfSpeech: 'คำสันธาน',
    example: {
      hanzi: '虽然下雨，但他还是去了。',
      pinyin: 'Suīrán xiàyǔ, dàn tā háishì qù le.',
      thai: 'แม้ว่าฝนจะตก แต่เขาก็ยังคงไป'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_d_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำคู่ไวยากรณ์ (แม้ว่า...แต่...)'
      }
    ]
  },
  {
    id: 'hsk2_s_002',
    hskLevel: 2,
    pinyinLetter: 'S',
    pinyinSortKey: 'suoyi',
    hanzi: '所以',
    pinyin: 'suǒyǐ',
    thaiMeaning: 'ดังนั้น, จึง',
    partOfSpeech: 'คำสันธาน',
    example: {
      hanzi: '因为生病，所以我没去上班。',
      pinyin: 'Yīnwèi shēngbìng, suǒyǐ wǒ méi qù shàngbān.',
      thai: 'เพราะว่าป่วย ดังนั้นฉันจึงไม่ได้ไปทำงาน'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_y_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำคู่ไวยากรณ์ (เพราะว่า...ดังนั้น...)'
      }
    ]
  },
  {
    id: 'hsk2_y_001',
    hskLevel: 2,
    pinyinLetter: 'Y',
    pinyinSortKey: 'yinwei',
    hanzi: '因为',
    pinyin: 'yīnwèi',
    thaiMeaning: 'เพราะว่า, เนื่องจาก',
    partOfSpeech: 'คำสันธาน',
    example: {
      hanzi: '因为下雪，路不好走。',
      pinyin: 'Yīnwèi xiàxuě, lù bù hǎo zǒu.',
      thai: 'เพราะหิมะตก ถนนจึงเดินลำบาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_s_002',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำคู่ไวยากรณ์ (เพราะว่า...ดังนั้น...)'
      }
    ]
  },
  {
    id: 'hsk2_z_001',
    hskLevel: 2,
    pinyinLetter: 'Z',
    pinyinSortKey: 'zao',
    hanzi: '早',
    pinyin: 'zǎo',
    thaiMeaning: 'เช้า, แต่เช้า',
    partOfSpeech: 'คำคุณศัพท์/คำนามบอกเวลา',
    example: {
      hanzi: '早上好，老师！',
      pinyin: 'Zǎoshang hǎo, lǎoshī!',
      thai: 'อรุณสวัสดิ์ครับคุณครู'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_z_002',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลช่วงเวลา (เที่ยง)'
      },
      {
        targetWordId: 'hsk2_w_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลช่วงเวลา (ค่ำ/เย็น)'
      }
    ]
  },
  {
    id: 'hsk2_z_002',
    hskLevel: 2,
    pinyinLetter: 'Z',
    pinyinSortKey: 'zhongwu',
    hanzi: '中午',
    pinyin: 'zhōngwǔ',
    thaiMeaning: 'ตอนเที่ยง, เที่ยงวัน',
    partOfSpeech: 'คำนามบอกเวลา',
    example: {
      hanzi: '我们中午十二点吃午饭。',
      pinyin: 'Wǒmen zhōngwǔ shí’èr diǎn chī wǔfàn.',
      thai: 'พวกเรากินข้าวเที่ยงตอนสิบสองนาฬิกา'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_z_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลช่วงเวลา (เช้า)'
      },
      {
        targetWordId: 'hsk2_w_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลช่วงเวลา (ค่ำ/เย็น)'
      }
    ]
  },
  {
    id: 'hsk2_w_001',
    hskLevel: 2,
    pinyinLetter: 'W',
    pinyinSortKey: 'wan',
    hanzi: '晚',
    pinyin: 'wǎn',
    thaiMeaning: 'สาย, ค่ำ, ดึก',
    partOfSpeech: 'คำคุณศัพท์/คำนามบอกเวลา',
    example: {
      hanzi: '昨天晚上我睡得很晚。',
      pinyin: 'Zuótiān wǎnshang wǒ shuì de hěn wǎn.',
      thai: 'เมื่อคืนฉันนอนดึกมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_z_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลช่วงเวลา (เช้า)'
      },
      {
        targetWordId: 'hsk2_z_002',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลช่วงเวลา (เที่ยง)'
      }
    ]
  },

  // ==========================================
  // HSK 3 VOCABULARY (A-Z)
  // ==========================================
  {
    id: 'hsk3_b_001',
    hskLevel: 3,
    pinyinLetter: 'B',
    pinyinSortKey: 'baohu',
    hanzi: '保护',
    pinyin: 'bǎohù',
    thaiMeaning: 'ปกป้อง, อนุรักษ์',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '我们应该保护环境。',
      pinyin: 'Wǒmen yīnggāi bǎohù huánjìng.',
      thai: 'พวกเราควรปกป้องสิ่งแวดล้อม'
    },
    relatedWords: []
  },
  {
    id: 'hsk3_c_001',
    hskLevel: 3,
    pinyinLetter: 'C',
    pinyinSortKey: 'chaoji',
    hanzi: '聪明',
    pinyin: 'cōngming',
    thaiMeaning: 'ฉลาด, มีไหวพริบ',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这个孩子非常聪明。',
      pinyin: 'Zhège háizi fēicháng cōngming.',
      thai: 'เด็กคนนี้ฉลาดมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_s_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (โง่/ทื่อ)'
      }
    ]
  },
  {
    id: 'hsk3_d_001',
    hskLevel: 3,
    pinyinLetter: 'D',
    pinyinSortKey: 'di',
    hanzi: '低',
    pinyin: 'dī',
    thaiMeaning: 'ต่ำ, ก้ม',
    partOfSpeech: 'คำคุณศัพท์/กริยา',
    example: {
      hanzi: '今天的气温很低。',
      pinyin: 'Jīntiān de qìwēn hěn dī.',
      thai: 'อุณหภูมิวันนี้ต่ำมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_g_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลระดับ (สูง)'
      },
      {
        targetWordId: 'hsk1_z_001',
        relationType: 'SPECTRUM',
        relationLabelThai: 'สเกลระดับ (กลาง)'
      }
    ]
  },
  {
    id: 'hsk3_f_001',
    hskLevel: 3,
    pinyinLetter: 'F',
    pinyinSortKey: 'fuxí',
    hanzi: '复习',
    pinyin: 'fùxí',
    thaiMeaning: 'ทบทวน (บทเรียน)',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '考试前要好好复习。',
      pinyin: 'Kǎoshì qián yào hǎohāo fùxí.',
      thai: 'ก่อนสอบต้องทบทวนให้ดี'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_y_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำคู่การเรียน (เตรียมบทเรียนล่วงหน้า)'
      }
    ]
  },
  {
    id: 'hsk3_g_001',
    hskLevel: 3,
    pinyinLetter: 'G',
    pinyinSortKey: 'ganjing',
    hanzi: '干净',
    pinyin: 'gānjìng',
    thaiMeaning: 'สะอาด',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这个房间打扫得很干净。',
      pinyin: 'Zhège fángjiān dǎsǎo de hěn gānjìng.',
      thai: 'ห้องนี้ทำความสะอาดได้สะอาดมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_z_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (สกปรก)'
      }
    ]
  },
  {
    id: 'hsk3_j_001',
    hskLevel: 3,
    pinyinLetter: 'J',
    pinyinSortKey: 'jiankang',
    hanzi: '健康',
    pinyin: 'jiànkāng',
    thaiMeaning: 'สุขภาพแข็งแรง, สุขภาพ',
    partOfSpeech: 'คำนาม/คุณศัพท์',
    example: {
      hanzi: '祝你身体健康！',
      pinyin: 'Zhù nǐ shēntǐ jiànkāng!',
      thai: 'ขอให้คุณมีสุขภาพแข็งแรง!'
    },
    relatedWords: []
  },
  {
    id: 'hsk3_n_001',
    hskLevel: 3,
    pinyinLetter: 'N',
    pinyinSortKey: 'nan',
    hanzi: '难',
    pinyin: 'nán',
    thaiMeaning: 'ยาก, ลำบาก',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '汉字其实不太难。',
      pinyin: 'Hànzì qíshí bú tài nán.',
      thai: 'จริงๆ แล้วตัวอักษรจีนไม่ได้ยากเกินไป'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_r_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ง่าย)'
      }
    ]
  },
  {
    id: 'hsk3_p_001',
    hskLevel: 3,
    pinyinLetter: 'P',
    pinyinSortKey: 'pang',
    hanzi: '胖',
    pinyin: 'pàng',
    thaiMeaning: 'อ้วน',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '他最近吃多了，长胖了。',
      pinyin: 'Tā zuìjìn chī duō le, zhǎng pàng le.',
      thai: 'ช่วงนี้เขากินเยอะ เลยอ้วนขึ้น'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_s_002',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ผอม)'
      }
    ]
  },
  {
    id: 'hsk3_q_001',
    hskLevel: 3,
    pinyinLetter: 'Q',
    pinyinSortKey: 'qingchu',
    hanzi: '清楚',
    pinyin: 'qīngchu',
    thaiMeaning: 'ชัดเจน, แจ่มแจ้ง',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '字写得不够清楚。',
      pinyin: 'Zì xiě de bú gòu qīngchu.',
      thai: 'ตัวหนังสือเขียนยังไม่ชัดเจนพอ'
    },
    relatedWords: [
      {
        targetWordId: 'hsk2_m_002',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำใกล้เคียง'
      }
    ]
  },
  {
    id: 'hsk3_r_001',
    hskLevel: 3,
    pinyinLetter: 'R',
    pinyinSortKey: 'rongyi',
    hanzi: '容易',
    pinyin: 'róngyì',
    thaiMeaning: 'ง่าย, ง่ายดาย',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这道数学题很容易。',
      pinyin: 'Zhè dào shùxuétí hěn róngyì.',
      thai: 'โจทย์คณิตศาสตร์ข้อนี้ง่ายมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_n_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ยาก)'
      }
    ]
  },
  {
    id: 'hsk3_s_001',
    hskLevel: 3,
    pinyinLetter: 'S',
    pinyinSortKey: 'sha',
    hanzi: '傻',
    pinyin: 'shǎ',
    thaiMeaning: 'โง่, ทึ่ม, ซื่อเกินไป',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '别做傻事了。',
      pinyin: 'Bié zuò shǎshì le.',
      thai: 'อย่าทำเรื่องโง่ๆ เลย'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_c_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (ฉลาด)'
      }
    ]
  },
  {
    id: 'hsk3_s_002',
    hskLevel: 3,
    pinyinLetter: 'S',
    pinyinSortKey: 'shou',
    hanzi: '瘦',
    pinyin: 'shòu',
    thaiMeaning: 'ผอม, บาง',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '他比去年瘦了很多。',
      pinyin: 'Tā bǐ qùnián shòu le hěn duō.',
      thai: 'เขาผอมลงกว่าปีที่แล้วมาก'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_p_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (อ้วน)'
      }
    ]
  },
  {
    id: 'hsk3_t_001',
    hskLevel: 3,
    pinyinLetter: 'T',
    pinyinSortKey: 'turan',
    hanzi: '突然',
    pinyin: 'tūrán',
    thaiMeaning: 'กะทันหัน, ทันใดนั้น',
    partOfSpeech: 'คำวิเศษณ์/คุณศัพท์',
    example: {
      hanzi: '突然下起大雨来了。',
      pinyin: 'Tūrán xià qǐ dàyǔ lái le.',
      thai: 'จู่ๆ ฝนก็ตกลงมาอย่างหนัก'
    },
    relatedWords: []
  },
  {
    id: 'hsk3_x_001',
    hskLevel: 3,
    pinyinLetter: 'X',
    pinyinSortKey: 'xinxiān',
    hanzi: '新鲜',
    pinyin: 'xīnxiān',
    thaiMeaning: 'สด, ใหม่',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '这儿的水果都很新鲜。',
      pinyin: 'Zhèr de shuǐguǒ dōu hěn xīnxiān.',
      thai: 'ผลไม้ที่นี่สดมากทั้งหมด'
    },
    relatedWords: []
  },
  {
    id: 'hsk3_y_001',
    hskLevel: 3,
    pinyinLetter: 'Y',
    pinyinSortKey: 'yuxi',
    hanzi: '预习',
    pinyin: 'yùxí',
    thaiMeaning: 'เตรียมบทเรียนล่วงหน้า',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '明天上课前请预习生词。',
      pinyin: 'Míngtiān shàngkè qián qǐng yùxí shēngcí.',
      thai: 'ก่อนเริ่มเรียนพรุ่งนี้ กรุณาเตรียมคำศัพท์ใหม่ล่วงหน้า'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_f_001',
        relationType: 'SYNONYM_PAIR',
        relationLabelThai: 'คำคู่การเรียน (ทบทวน)'
      }
    ]
  },
  {
    id: 'hsk3_z_001',
    hskLevel: 3,
    pinyinLetter: 'Z',
    pinyinSortKey: 'zang',
    hanzi: '脏',
    pinyin: 'zāng',
    thaiMeaning: 'สกปรก, เลอะเทอะ',
    partOfSpeech: 'คำคุณศัพท์',
    example: {
      hanzi: '手脏了要洗手。',
      pinyin: 'Shǒu zāng le yào xǐshǒu.',
      thai: 'มือสกปรกแล้วต้องล้างมือ'
    },
    relatedWords: [
      {
        targetWordId: 'hsk3_g_001',
        relationType: 'ANTONYM',
        relationLabelThai: 'คำตรงข้าม (สะอาด)'
      }
    ]
  },
  {
    id: 'hsk3_z_002',
    hskLevel: 3,
    pinyinLetter: 'Z',
    pinyinSortKey: 'zhaogu',
    hanzi: '照顾',
    pinyin: 'zhàogu',
    thaiMeaning: 'ดูแล, เอาใจใส่',
    partOfSpeech: 'คำกริยา',
    example: {
      hanzi: '生病的时候需要人照顾。',
      pinyin: 'Shēngbìng de shíhou xūyào rén zhàogu.',
      thai: 'เวลาป่วยจำเป็นต้องมีคนดูแล'
    },
    relatedWords: []
  }
];
