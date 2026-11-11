/**
 * Отзывы Google Maps, сбор 2026-11-11.
 * Тексты дословные, с опечатками и пробелами источника.
 * Сокращать можно только знаком «…», не переписывать.
 * В schema.org их не кладём: Google не принимает
 * самодельный aggregateRating / review для LocalBusiness.
 */

export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=10197345996895462953";
export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/YqFXduUcaWz6ovzn9";
export const GOOGLE_RATING_LABEL = "5,0 ★ · 40 отзывов в Google";
export const GOOGLE_REVIEWS_HEADING = "5,0 · 40 отзывов в Google Картах";

export type GoogleReview = {
  id: string;
  name: string;
  text: string;
  tour?: string;
};

const elenaShi: GoogleReview = {
  id: "elena-shi",
  name: "Elena Shi",
  tour: "«Душевный Мадрид»",
  text: `Мы были с Евой на экскурсии "Душевный Мадрид". Прекрасно провели время, узнали много интересных фактов о Мадриде, которые не прочтёшь нигде. Ева любит этот город и рассказывает о нём с большим энтузиазмом, что придет особый шарм прогулке. В следующую нашу поездку в Мадрид обязательно обратимся снова.`,
};

const jeylaHuseynova: GoogleReview = {
  id: "jeyla-huseynova",
  name: "Jeyla Huseynova",
  tour: "Madrid + Toledo",
  text: `Мы с мамой воспользовались услугами Евы и заказали обзорные экскурсии в Мадриде и в Толедо. Мне есть с чем сравнивать, я опытный путешественник ) и гидов за мою жизнь было не мало . Сказать ,что остались довольными, это ничего не сказать! Интересно,  душевно, множество интересных фактов,историй ,о которых мало кто расскажет , все чётко, а самое главное,  с душой ! … Теперь Испания только с Евой 👌👌`,
};

const dariyaVlasova: GoogleReview = {
  id: "dariya-vlasova",
  name: "Dariya Vlasova",
  tour: "Madrid",
  text: `Экскурсия была самым ярким моментом нашей поездки в Мадрид. Отлично составленный план, емкие интересные факты, дружелюбная и легкая атмосфера сделали незаметными 3,5 часа, которые пролетели как один миг. С удовольствием пересматриваем фото и обязательно вернемся, чтобы продолжить исследовать Испанию. Обязательно с Евой :)`,
};

const svetlanaPatseva: GoogleReview = {
  id: "svetlana-patseva",
  name: "Svetlana Patseva",
  tour: "Madrid",
  text: `Живу в Мадриде 1,5 года, столько раз ходила по этим улицам, мимо этих домов, памятников и даже не подозревала сколько всего интересного вокруг. Ева очень приятно вела экскурсию, узнала от нее множество любопытных фактов, многие городские названия теперь приобрели для меня смысл. Даже не ожидала, что наша прогулка будет настолько познавательной! …`,
};

const innaDorn: GoogleReview = {
  id: "inna-dorn",
  name: "Inna Dorn",
  tour: "gastro Madrid + Valencia",
  text: `Отличный гид!  Очень живописные места, увлекательные истории, вкусная еда! Брали гастротур по Мадриду и поездку на весь день в Валенсию. Очень рекомендую и, если будем в Испании в будущем, обязательно встретимся еще 🙌`,
};

const aleksandrBaraban: GoogleReview = {
  id: "aleksandr-baraban",
  name: "Александр Барабан",
  text: `Друзья ! Несомненно нужно брать экскурсии вместе с Евой, это не просто экскурсия , это душевная прогулка по достопримечательностям и интересным местам с замечательным человеком который вкладывает всю себя в этот замечательный трип … Ева ты лучшая !!!!`,
};

/** Главная: отзывы 1–6 из файла. */
export const homeReviews: GoogleReview[] = [
  elenaShi,
  jeylaHuseynova,
  dariyaVlasova,
  svetlanaPatseva,
  innaDorn,
  aleksandrBaraban,
];

/** Страница «Душевный Мадрид»: Elena Shi и Dariya Vlasova. */
export const madridPageReviews: GoogleReview[] = [elenaShi, dariyaVlasova];

/** Страница Толедо: Jeyla Huseynova (Мадрид + Толедо). */
export const toledoReviews: GoogleReview[] = [jeylaHuseynova];
