const quotes = [
    {
        quote : "있다고 다 보여주지 말고, 안다고 다 말하지 말고, 가졌다고 다 빌려주지 말고, 들었다고 다 믿지 마라",
        author : "셰익스피어",
    },
    {
        quote : "신은 용기있는자를 결코 버리지 않는다",
        author : "켄러",
    },
    {
        quote : "단순하게 살아라. 현대인은 쓸데없는 절차와 일 때문에 얼마나 복잡한 삶을 살아가는가?",
        author : "이드리스 샤흐",
    },
    {
        quote : "만족할 줄 아는 사람은진정한 부자이고, 탐욕스러운 사람은진실로 가난한 사람이다.",
        author : "솔론",
    },
    {
        quote : "성공의 비결은 단 한 가지, 잘할 수 있는 일에 광적으로 집중하는 것이다.",
        author : "톰 모나건",
    },
    {
        quote : "행복은 습관이다,그것을 몸에 지니라",
        author : "허버드",
    },
    {
        quote : "네 믿음은 네 생각이 된다 . 네 생각은  네 말이 된다. 네말은 네 행동이 된다 네행동은 네 습관이된다 . 네 습관은 네 가치가 된다 . 네 가치는 네 운명이 된다.",
        author : "간디"
    },
    {
        quote : "꿈을 계속 간직하고 있으면 반드시 실현할 때가 온다.",
        author : "괴테",
    },
    {
        quote : "마음만을 가지고 있어서는 안된다. 반드시 실천하여야 한다.",
        author : "이소룡",
    },
    {
        quote : "최고에 도달하려면 최저에서 시작하라.",
        author : "P.시루스"
    }
];

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");

const todaysQuote = quotes[Math.floor(Math.random()*quotes.length)];

quote.innerText = todaysQuote.quote;
author.innerText = todaysQuote.author;