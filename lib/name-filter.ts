export type NameValidationError =
  | "name_too_short"
  | "name_too_long"
  | "name_invalid_chars"
  | "name_contact_info_forbidden"
  | "name_inappropriate"

/// Kullanıcı isimlerini filtrelemek ve doğruluk denetimi yapmak için servis.
export class NameFilterService {
  private static readonly turkishBadWords: string[] = [
    "amk", "aq", "oc", "orospu", "pic", "sik", "yarrak", "got", "meme",
    "tasak", "gavat", "pezevenk", "kahpe", "ibne", "dol", "sikik", "amcik",
    "sikerim", "anani", "skrm", "mk", "sg", "bok", "gerizekali", "salak",
    "aptal", "mal", "dangalak", "hiyar", "pust", "kaltak", "surtuk", "kevase",
    "yarak", "sikem", "sokam", "sokarim", "amq", "amguard", "yarag",
    // Yaygın türevler ve birleşik formlar
    "sikici", "orosbucocu", "amkoyim", "amina", "gotunu", "siktir",
    "picleri", "gavatlık", "orospucocugu", "anasini", "ananizi",
  ]

  /// Leetspeak (Harf yerine rakam/sembol kullanımı) dönüşüm haritası
  private static readonly leetspeakMap: Record<string, string> = {
    "4": "a", "@": "a",
    "8": "b",
    "3": "e",
    "6": "g", "9": "g",
    "1": "i", "!": "i", "|": "i",
    "0": "o",
    "5": "s", "$": "s",
    "7": "t", "+": "t",
    "v": "u",
    "2": "z",
  }

  /// Benzer görünen Unicode karakterleri Latin karşılıklarına dönüştürür.
  /// Kiril, Yunan ve diğer alfabelerdeki homoglyphleri yakalar.
  private static readonly homoglyphMap: Record<string, string> = {
    // Kiril homoglyphler
    "а": "a", "А": "a", // Cyrillic A
    "в": "b", "В": "b", // Cyrillic VE
    "с": "c", "С": "c", // Cyrillic ES
    "е": "e", "Е": "e", // Cyrillic IE
    "і": "i", "І": "i", // Cyrillic I (Ukrainian)
    "к": "k", "К": "k", // Cyrillic KA
    "м": "m", "М": "m", // Cyrillic EM
    "о": "o", "О": "o", // Cyrillic O
    "р": "p", "Р": "p", // Cyrillic ER
    "т": "t", "Т": "t", // Cyrillic TE
    "х": "x", "Х": "x", // Cyrillic HA
    "у": "y", "У": "y", // Cyrillic U
    // Yaygın sembol homoglyphler
    "ℓ": "l",
    "ⅰ": "i", "ⅱ": "ii",
  }

  /// Türkçe karakterleri İngilizce karşılıklarına dönüştürür (Karşılaştırma tutarlılığı için)
  private static normalizeTurkishChars(input: string): string {
    return input
      .replace(/ç/g, "c").replace(/Ç/g, "c")
      .replace(/ğ/g, "g").replace(/Ğ/g, "g")
      .replace(/ı/g, "i").replace(/İ/g, "i")
      .replace(/ö/g, "o").replace(/Ö/g, "o")
      .replace(/ş/g, "s").replace(/Ş/g, "s")
      .replace(/ü/g, "u").replace(/Ü/g, "u")
  }

  /// Unicode homoglyphleri standart Latin harflerine dönüştürür.
  private static normalizeHomoglyphs(input: string): string {
    let result = input
    for (const key in this.homoglyphMap) {
      if (Object.prototype.hasOwnProperty.call(this.homoglyphMap, key)) {
        result = result.split(key).join(this.homoglyphMap[key])
      }
    }
    return result
  }

  /// Zero-width ve görünmez Unicode karakterleri temizler.
  private static stripInvisibleChars(input: string): string {
    return input.replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD\u2060\u180E\u202A-\u202E\u2066-\u2069]/g, "")
  }

  /// Unicode combining mark'ları (aksan işaretleri vb.) temizler.
  private static stripCombiningMarks(input: string): string {
    return input.replace(/[\u0300-\u036F]/g, "")
  }

  /// Metindeki Leetspeak karakterleri standart harflere dönüştürür.
  private static decodeLeetspeak(input: string): string {
    let decoded = input
    for (const key in this.leetspeakMap) {
      if (Object.prototype.hasOwnProperty.call(this.leetspeakMap, key)) {
        decoded = decoded.split(key).join(this.leetspeakMap[key])
      }
    }
    return decoded
  }

  /// Ardışık tekrarlanan karakterleri teke düşürür.
  /// Örn: "siiiiik" → "sik", "ammmk" → "amk"
  private static collapseRepeats(input: string): string {
    return input.replace(/(.)\1+/g, "$1")
  }

  private static hasBadWord(target: string): boolean {
    return this.turkishBadWords.some((word) => target.includes(word))
  }

  /// İsmin uygunsuz kelime, Leetspeak veya gizlenmiş küfür içerip içermediğini denetler.
  public static containsProfanity(name: string): boolean {
    // 0. Görünmez karakterleri ve combining mark'ları temizle
    let clean = this.stripInvisibleChars(name.toLowerCase().trim())
    clean = this.stripCombiningMarks(clean)

    // 1. Türkçe karakter ve homoglyph normalizasyonu
    let normalized = this.normalizeTurkishChars(clean)
    normalized = this.normalizeHomoglyphs(normalized)

    // Doğrudan kontrolden geçir
    if (this.hasBadWord(normalized)) return true

    // 2. Leetspeak çözümlemesi yap (Örn: s1k3r1m -> sikerim)
    const decoded = this.decodeLeetspeak(normalized)
    if (this.hasBadWord(decoded)) return true

    // 3. Özel karakter ve boşlukları silerek kontrol et (Örn: p.i.c -> pic)
    const condensed = decoded.replace(/[^a-z0-9]/g, "")
    if (this.hasBadWord(condensed)) return true

    // 4. Ardışık tekrarlanan karakterleri sıkıştırarak kontrol et (Örn: siiiiik -> sik)
    const collapsed = this.collapseRepeats(condensed)
    if (this.hasBadWord(collapsed)) return true

    return false
  }

  /// Telefon numarası, E-posta veya Web sitesi gibi kişisel verileri tespit eder.
  public static containsContactInfo(name: string): boolean {
    const cleanName = name.replace(/\s+/g, "")

    // Telefon numaraları (Örn: 05xx..., 5xx..., +905xx...)
    const phoneRegex = /(\+?90|0)?5\d{9}/i

    // E-posta adresleri
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i

    // Bağlantılar (http, www, .com, .net vb.)
    const urlRegex = /(https?:\/\/|www\.)|[a-zA-Z0-9-]+\.(com|net|org|io|gg|me|co)/i

    return phoneRegex.test(cleanName) || emailRegex.test(cleanName) || urlRegex.test(cleanName)
  }

  /// İsim validasyonu yapar.
  /// Uygunsa null, değilse ilgili hatayı döndürür.
  public static validate(name: string): NameValidationError | null {
    const trimmed = name.trim()

    if (trimmed.length < 2) {
      return "name_too_short"
    }

    if (trimmed.length > 20) {
      return "name_too_long"
    }

    // Sadece harf, rakam, boşluk, çizgi ve alt çizgi izin ver
    const validChars = /^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9 _-]+$/
    if (!validChars.test(trimmed)) {
      return "name_invalid_chars"
    }

    // Telefon, E-posta veya Link denetimi
    if (this.containsContactInfo(trimmed)) {
      return "name_contact_info_forbidden"
    }

    // Küfür ve Argo denetimi
    if (this.containsProfanity(trimmed)) {
      return "name_inappropriate"
    }

    return null
  }
}
