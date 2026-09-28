/**
 * Delivery guides — the comparison pages that earn referral fees.
 *
 * Prices are what the services and independent reviews showed on the `checked`
 * date. They change often; the page prints the date so readers can judge.
 * Facts here were cross-checked against The Kitchn (Aug 2026), NBC Select
 * (Sep 2026), The Good Trade (Jul 2026), My Subscription Addiction (Mar 2026)
 * and the services' own sites.
 */

export interface Pick {
  /** key into content/affiliates.ts */
  key: string
  name: string
  /** one-line verdict shown in the table and card header */
  verdict: string
  price: string
  format: string
  shipping: string
  area: string
  bestFor: string
  good: string[]
  bad: string[]
  /** 2–3 sentences of plain-English opinion */
  take: string
}

export interface Guide {
  slug: string
  title: string
  h1: string
  blurb: string
  description: string
  checked: string
  intro: string[]
  picks: Pick[]
  howWeChose: string[]
  faq: { q: string; a: string }[]
  /** related guide slugs */
  related: string[]
}

export const guides: Guide[] = [
  {
    slug: 'vegan-meal-delivery',
    title: 'Best vegan meal delivery services',
    h1: 'The best vegan meal delivery services, compared',
    blurb: 'Ready-to-eat and heat-and-eat plant-based meals, ranked by what you actually pay per plate.',
    description:
      'Seven fully plant-based meal delivery services compared on real price per serving, shipping, freshness and who each one suits. Prices checked September 2026.',
    checked: '2026-09-28',
    intro: [
      'A vegan meal delivery service is worth it on exactly the weeks you would otherwise eat toast for dinner. The trick is paying for the format you will actually use: a fridge full of fresh bowls is wasted if you travel, and frozen meals are wasted if you hate microwaves.',
      'We looked at seven services that are entirely plant-based, or have a plant-based plan good enough to stand on its own. The table shows the price you pay per serving at a normal order size, not the first-box promo, plus shipping, because a $9 box fee on a four-meal order is a 25% surcharge.',
    ],
    picks: [
      {
        key: 'purple-carrot',
        name: 'Purple Carrot',
        verdict: 'Best overall',
        price: 'About $11 per serving for kits, $13 for prepared meals',
        format: 'Cook-yourself kits (2 or 4 servings) and single-serve prepared meals',
        shipping: 'Free on most plans; small orders may carry a fee',
        area: 'Contiguous US',
        bestFor: 'People who want one service that does both cooking nights and lazy nights',
        good: ['Everything on the menu is plant-based, so there is nothing to filter', 'Kits are genuinely good: beet burgers, miso-glazed eggplant, proper sauces', 'Prepared meals cover the nights you cannot be bothered'],
        bad: ['You cannot pick your delivery day on every plan', 'Portions on kits run modest for big appetites'],
        take: 'Purple Carrot has been the only 100% plant-based kit for years and it shows in the recipes, which taste like someone cooked vegetables on purpose rather than removed the meat. Start on the kit plan; add prepared meals once you know which nights you actually cook.',
      },
      {
        key: 'hungryroot',
        name: 'Hungryroot',
        verdict: 'Best value',
        price: 'Roughly $4 breakfast, $6 lunch, $9 dinner per serving',
        format: 'Grocery-style box with 10-minute recipes and ready-made items',
        shipping: '$6.99, free over about $70',
        area: 'Contiguous US',
        bestFor: 'Households that want groceries and meals in one order, with a plant-based filter switched on',
        good: ['Cheapest way to get a week of plant-based dinners delivered', 'Very little cooking: most recipes are assemble-and-heat', 'Easy to skip weeks'],
        bad: ['Not vegan-only: you set the preference in a quiz and check each item', 'Less chef-y than Purple Carrot; think good weeknight food, not date night'],
        take: 'Hungryroot is the one to pick if the alternative is takeout three nights a week. Set the plant-based preference during the quiz, then treat the weekly box as your grocery run rather than a restaurant substitute.',
      },
      {
        key: 'sprinly',
        name: 'Sprinly',
        verdict: 'Best fresh, no-cook',
        price: 'About $18 per meal (6 meals from around $109)',
        format: 'Fresh, never frozen, ready to eat',
        shipping: 'About $9.99 per box',
        area: 'Most of the contiguous US',
        bestFor: 'Anyone who wants restaurant-quality vegan food with zero prep',
        good: ['Organic ingredients and big, satisfying portions', 'Menus lean whole-food: grains, legumes, lots of vegetables', 'Meals keep about a week in the fridge'],
        bad: ['The most expensive per meal in this list after Sakara', 'Six-meal minimum every order'],
        take: 'Sprinly costs what a good lunch out costs, and the food is better than most of them. If you are eating vegan for health reasons and hate cooking, this is the one.',
      },
      {
        key: 'mosaic-foods',
        name: 'Mosaic Foods',
        verdict: 'Best frozen',
        price: 'Bowls about $11, soups about $9, family meals about $24 for four',
        format: 'Frozen, handmade veggie bowls, soups, pizzas and family trays',
        shipping: '$9.99 to $19.99, free on orders of 12 or more',
        area: 'Eastern and central US; check your zip',
        bestFor: 'Stocking the freezer with meals that actually taste of vegetables',
        good: ['Frozen means no waste and no fixed delivery rhythm', 'Family meals are a rare thing in vegan delivery', 'Ingredients sourced from named farms'],
        bad: ['Delivery does not reach the whole country', 'Freezer space: a 12-meal order is a lot of boxes'],
        take: 'Mosaic is what frozen food should have been all along. Order twelve at a time to kill the shipping fee and you have a month of backup dinners.',
      },
      {
        key: 'splendid-spoon',
        name: 'Splendid Spoon',
        verdict: 'Best for lunches and smoothies',
        price: 'Smoothies about $10, soups and bowls $12 to $13.50',
        format: 'Ready-made smoothies, soups, grain bowls and noodles (fridge and freezer)',
        shipping: 'Charged on boxes under 10 meals, free above',
        area: 'Contiguous US',
        bestFor: 'Weekday lunches at a desk',
        good: ['Everything is vegan and gluten-free', 'Grab-and-go format fits office life', 'Broad menu, 50-plus items'],
        bad: ['Shipping fee bites on small orders', 'Dinners are the weakest part of the range'],
        take: 'Think of Splendid Spoon as a lunch subscription rather than a dinner one. The smoothies and soups earn their place; buy dinners elsewhere.',
      },
      {
        key: 'green-chef',
        name: 'Green Chef',
        verdict: 'Best organic kit with a plant-based plan',
        price: 'About $12 per serving after the first-box promo',
        format: 'Cook-yourself kits, 2 to 6 servings, organic ingredients',
        shipping: '$9.99 per box',
        area: 'Contiguous US',
        bestFor: 'Households where one person is vegan and the others are not',
        good: ['Certified organic produce, which most kits are not', 'Recipes are flavorful and easy, 30 minutes or so', 'Mixed households can order across plans'],
        bad: ['Plant-based is one plan among many; the vegan selection is thin some weeks', 'The advertised $6 price is the promo, not what you pay'],
        take: 'Green Chef is a very good kit that happens to have a plant-based plan. If everyone in your house eats plants, Purple Carrot is the better fit; if not, Green Chef keeps the peace.',
      },
      {
        key: 'sakara',
        name: 'Sakara Life',
        verdict: 'The luxury option',
        price: 'About $23 to $28 per meal, roughly $140 per week minimum',
        format: 'Fresh, organic, ready to eat',
        shipping: 'Free to about $10 depending on plan',
        area: 'Contiguous US',
        bestFor: 'A reset week when money is not the constraint',
        good: ['Beautiful, vibrant food with generous vegetables', 'Structured programs from one to eight weeks', 'Organic and gluten-free throughout'],
        bad: ['Two to three times the price of everything else here', 'Some items contain honey, so check if you avoid it'],
        take: 'Sakara is the vegan meal delivery equivalent of a spa. Lovely for a week, hard to justify for a year. We list it because people ask.',
      },
    ],
    howWeChose: [
      'Plant-based first: the service is fully vegan, or its vegan plan is big enough to eat from every week without repeating.',
      'Real prices: per-serving cost at a typical order, plus shipping, not the first-box discount.',
      'Format honesty: we say whether meals are fresh, frozen or cook-yourself, because that decides whether you will use them.',
      'Coverage: we note where a service does not deliver instead of pretending everything ships nationwide.',
    ],
    faq: [
      { q: 'What is the cheapest vegan meal delivery service?', a: 'Hungryroot works out cheapest for full weeks, at roughly $9 per dinner serving and less for lunches and breakfasts. Purple Carrot kits at about $11 per serving are the cheapest fully plant-based option.' },
      { q: 'Are vegan meal delivery services worth it?', a: 'They are worth it on the weeks you would otherwise order takeout. A $12 delivered meal beats a $20 delivery-app dinner; it does not beat a $4 bowl of lentils you cooked yourself. Most people do best with a small plan and a farmers market habit for the rest.' },
      { q: 'Which vegan meal delivery is fresh, not frozen?', a: 'Sprinly and Sakara ship fresh, never-frozen meals. Purple Carrot kits are fresh ingredients; its prepared meals arrive frozen. Mosaic Foods is frozen by design.' },
    ],
    related: ['plant-based-meal-kits', 'organic-produce-delivery'],
  },
  {
    slug: 'plant-based-meal-kits',
    title: 'Best plant-based meal kits',
    h1: 'The best plant-based meal kits for people who like to cook',
    blurb: 'Kits with the chopping left in. Which ones treat vegetables as the main event.',
    description:
      'Six meal kits compared for vegetarians and vegans who cook: price per serving, shipping, how many plant-based recipes you actually get each week, and what the vegetables are like. Checked September 2026.',
    checked: '2026-09-28',
    intro: [
      'Meal kits are a good fit for plant-based cooking because vegetables are where the prep time goes. Someone else has portioned the miso, found the smoked paprika and cut the squash; you do the cooking that is fun.',
      'The catch is that most kits are built for omnivores and bolt on a veggie plan. So the question is not "does it have a vegetarian option" but "how many plant-based recipes are on the menu this week, and are they any good".',
    ],
    picks: [
      {
        key: 'purple-carrot',
        name: 'Purple Carrot',
        verdict: 'Best plant-based kit',
        price: 'About $11 per serving',
        format: 'Kits for 2 or 4, 2 to 4 recipes a week',
        shipping: 'Free on standard plans',
        area: 'Contiguous US',
        bestFor: 'Vegans and vegetarians who want the whole menu, not a corner of it',
        good: ['Every recipe is plant-based, with high-protein and gluten-free filters', 'Ingredient quality is consistently good', 'Recipes teach technique: you will learn a few sauces'],
        bad: ['Smaller menu than the giants', 'Delivery day is less flexible'],
        take: 'If you eat plants full time, this is the kit. The menu is small because everything on it is for you.',
      },
      {
        key: 'green-chef',
        name: 'Green Chef',
        verdict: 'Best organic',
        price: 'About $12 per serving after promos',
        format: 'Kits for 2, 4 or 6; plant-based plan plus others',
        shipping: '$9.99 per box',
        area: 'Contiguous US',
        bestFor: 'Organic produce without a CSA commitment',
        good: ['Certified organic ingredients', 'Clear, quick recipes', 'Mixed households can mix plans'],
        bad: ['Plant-based menu can be thin in a given week', 'Shipping fee on every box'],
        take: 'The organic sourcing is the reason to pay a dollar more per serving. Check the week\'s plant-based menu before you commit; some weeks it is four recipes, some weeks two.',
      },
      {
        key: 'hellofresh',
        name: 'HelloFresh',
        verdict: 'Biggest veggie menu',
        price: 'About $10 per serving',
        format: 'Kits for 2 or 4, 2 to 6 recipes a week',
        shipping: 'About $10 per box',
        area: 'Contiguous US',
        bestFor: 'Vegetarians who want lots of choice and do not mind that only one or two recipes a week are vegan',
        good: ['Around ten vegetarian recipes each week', 'Cheapest per serving of the big kits', 'Easy to swap proteins and sides'],
        bad: ['Usually only one fully vegan recipe a week', 'Recipes lean on cheese and cream for flavor'],
        take: 'HelloFresh is the mainstream choice for a reason: the menu is huge and the price is fair. For vegans it is a weekly game of "which one recipe"; for vegetarians it is plenty.',
      },
      {
        key: 'sunbasket',
        name: 'Sunbasket',
        verdict: 'Best for organic plus prepared meals',
        price: 'About $12 per serving kits, $10 prepared',
        format: 'Kits for 1, 2 or 4 plus Fresh & Ready meals',
        shipping: 'About $6',
        area: 'Most of the contiguous US',
        bestFor: 'One-person households; kits come in single servings',
        good: ['Organic produce and a proper vegetarian plan', 'Single-serving option is rare', 'Prepared meals for backup'],
        bad: ['Vegan selection is limited', 'Not built for families of five or more'],
        take: 'Sunbasket is the kit for people who live alone and cook properly. The single-serve kits and the organic sourcing justify the price.',
      },
      {
        key: 'hungryroot',
        name: 'Hungryroot',
        verdict: 'Least cooking',
        price: 'About $9 per dinner serving',
        format: 'Groceries plus 10-minute recipes',
        shipping: '$6.99, free over about $70',
        area: 'Contiguous US',
        bestFor: 'Weeknights when 30 minutes is too many',
        good: ['Fast: most recipes are assembly', 'Plant-based preference filters the whole catalogue', 'Doubles as your grocery order'],
        bad: ['Not a "kit" in the classic sense', 'You still shop the weekly box to keep it vegan'],
        take: 'Hungryroot is what you use when you like the idea of kits more than the reality. The food is honest and fast.',
      },
      {
        key: 'blue-apron',
        name: 'Blue Apron',
        verdict: 'Worth a look if the membership model suits you',
        price: 'Membership pricing; check current per-serving cost at checkout',
        format: 'Kits for 2 or 4, vegetarian plan with 2 to 5 recipes weekly',
        shipping: 'Included with membership',
        area: 'Contiguous US',
        bestFor: 'Vegetarians who cook most nights and want recipes ready in 25 to 35 minutes',
        good: ['Long-running vegetarian plan with reliable recipes', 'Shipping folded into the membership', 'Quick weeknight timings'],
        bad: ['Pricing model changed recently, so compare the real per-serving cost', 'Does not cater to vegan or allergen-specific diets well'],
        take: 'Blue Apron is fine, solid, unexciting. If you already have the membership it is worth using the veggie plan; we would not sign up just for it.',
      },
    ],
    howWeChose: [
      'We counted plant-based recipes on real weekly menus, not marketing pages.',
      'Price is per serving at a two-person, three-recipe order plus shipping.',
      'We favoured kits whose vegetarian recipes do not lean on cheese to taste of anything.',
    ],
    faq: [
      { q: 'Which meal kit is fully vegan?', a: 'Purple Carrot is the only major kit where every recipe is plant-based. Green Chef, HelloFresh, Sunbasket and Blue Apron each offer a vegetarian plan with some vegan recipes.' },
      { q: 'Are meal kits cheaper than a CSA?', a: 'No. A CSA share typically works out to $20 to $40 a week for a box of produce; a kit is $60 to $80 a week for three dinners for two. Kits buy you time and recipes; a CSA buys you vegetables. Many people do both: a CSA box plus a kit for the two nights the box would otherwise go to waste.' },
    ],
    related: ['vegan-meal-delivery', 'organic-produce-delivery'],
  },
  {
    slug: 'organic-produce-delivery',
    title: 'Best organic produce delivery boxes',
    h1: 'The best organic produce delivery boxes',
    blurb: 'Vegetable boxes to your door, including the "ugly" ones, and when a local CSA beats all of them.',
    description:
      'Produce box services compared on price, organic sourcing, delivery area and customization, with an honest note on when a local CSA share is the better deal. Checked September 2026.',
    checked: '2026-09-28',
    intro: [
      'A produce box is the halfway house between a supermarket and a CSA: you get a curated haul of fruit and vegetables every week, you can usually swap what you do not like, and nobody asks you to pay for the whole season up front.',
      'Before you subscribe to any of these, check whether a farm near you runs a CSA. Our directory lists nearly two thousand, and a share from a farm twenty miles away will beat a box shipped across the country on freshness, price and, frankly, taste.',
    ],
    picks: [
      {
        key: 'misfits-market',
        name: 'Misfits Market',
        verdict: 'Best nationwide',
        price: 'Pay per item; free delivery in many areas above a minimum',
        format: 'Weekly online grocery with organic and rescued "ugly" produce, plus pantry, dairy and more',
        shipping: 'Free in many zip codes; varies',
        area: 'Contiguous US',
        bestFor: 'Anyone outside the regional services\' delivery zones',
        good: ['Widest delivery area', 'You shop the box item by item, so nothing you hate arrives', 'Rescues produce that would otherwise be wasted'],
        bad: ['Ordering window is one day a week; miss it and you skip', 'Organic is a filter, not a guarantee on every item'],
        take: 'Misfits swallowed Imperfect Foods in 2022 and became the default produce delivery for most of the country. It is more grocery store than farm box now, which is exactly why it works.',
      },
      {
        key: 'farm-fresh-to-you',
        name: 'Farm Fresh To You',
        verdict: 'Best on the West Coast',
        price: 'Boxes from about $28',
        format: 'Certified-organic boxes from a family farm, customizable weekly',
        shipping: 'Included',
        area: 'California, Arizona, parts of Nevada and Utah',
        bestFor: 'Western households who want farm-direct without a CSA commitment',
        good: ['Certified organic, 130-plus varieties across the year', 'Swap items every week', 'Delivered by the farm\'s own vans'],
        bad: ['West Coast only', 'Early-morning drop-offs'],
        take: 'This is a CSA with the rough edges filed off: farm-direct organic produce, but you choose the box and can skip weeks. If you are in California, start here.',
      },
      {
        key: 'hungry-harvest',
        name: 'Hungry Harvest',
        verdict: 'Best on the East Coast',
        price: 'Boxes from about $17',
        format: 'Rescued produce boxes, organic and conventional options, customizable',
        shipping: 'Included in delivery areas',
        area: 'DC, DE, FL, MD, NC, NJ, PA, VA',
        bestFor: 'Mid-Atlantic and Southeast households on a budget',
        good: ['Cheapest entry price in this list', 'Every delivery rescues at least ten pounds of produce', 'Free customization and a grocery marketplace'],
        bad: ['Eight states only', 'Organic is an option, not the default'],
        take: 'Hungry Harvest is the value pick if you live in its footprint. The rescued-produce model means odd sizes, not bad quality.',
      },
      {
        key: 'farmbox-direct',
        name: 'Farmbox Direct',
        verdict: 'All organic, ships everywhere',
        price: 'Small, medium and large boxes; check current prices',
        format: '100% organic boxes with up to five swaps a week',
        shipping: 'Free across most of the Northeast, a fee elsewhere',
        area: 'Contiguous US',
        bestFor: 'People who want certified organic with no exceptions',
        good: ['Everything is organic', 'Weekly swaps and add-ons like bread and milk', 'No commitment'],
        bad: ['Shipping fee outside the Northeast', 'Less choice than Misfits'],
        take: 'A straightforward organic box. Choose it over Misfits if "organic, always" matters more to you than picking every item.',
      },
      {
        key: 'farm-to-people',
        name: 'Farm to People',
        verdict: 'Best in New York',
        price: 'Boxes from about $25',
        format: 'Farm-sourced boxes from 150-plus organic and regenerative farms',
        shipping: 'Included',
        area: 'NYC metro, Jersey City and Hoboken, Westchester, southern Connecticut',
        bestFor: 'New Yorkers who want the greenmarket without the queue',
        good: ['Named farms, real seasonality', 'Vegetarian and omnivore boxes with weekly swaps', 'Delivered in reusable packaging'],
        bad: ['Tiny delivery area', 'Prices reflect New York'],
        take: 'If you are in the delivery zone, this is as close to a farmers market as delivery gets.',
      },
    ],
    howWeChose: [
      'We favoured services that say where the produce comes from.',
      'Delivery area is listed honestly; most "national" boxes are regional.',
      'We compared entry prices, not promo prices, and noted where shipping is extra.',
    ],
    faq: [
      { q: 'Is a produce box cheaper than the supermarket?', a: 'Usually not for conventional produce; often yes for organic. The saving comes from wasting less: you eat what arrives instead of buying on impulse.' },
      { q: 'Produce box or CSA?', a: 'A CSA is cheaper per pound and fresher, but you pay up front for a season and get what the farm harvests. A produce box costs more and lets you choose and skip. If a CSA farm delivers to your town, try it for one season first.' },
    ],
    related: ['vegan-meal-delivery', 'plant-based-meal-kits'],
  },
  {
    slug: 'vegan-meal-planning-apps',
    title: 'Best vegan meal planning apps',
    h1: 'The best meal planning apps for plant-based eating',
    blurb: 'For when the vegetables are already in the fridge and the problem is deciding.',
    description:
      'Meal planning apps compared for vegan and vegetarian cooks: price, free tiers, grocery list and delivery integration, and how good the plant-based recipes are. Checked September 2026.',
    checked: '2026-09-28',
    intro: [
      'Most people who fall off plant-based eating do not fail at cooking; they fail at deciding. A meal planner takes the daily "what\'s for dinner" and turns it into one Sunday decision and a shopping list.',
      'We looked at planners that either specialise in plant-based food or handle it well. Cheap ones with a free tier are listed first, because the best planner is the one you keep opening.',
    ],
    picks: [
      {
        key: 'mealime',
        name: 'Mealime',
        verdict: 'Best free option',
        price: 'Free; Pro about $2.99 a month',
        format: 'Recipe-based planner with auto grocery lists',
        shipping: 'n/a',
        area: 'iOS, Android, web',
        bestFor: 'Getting started without paying',
        good: ['Vegan, vegetarian and flexitarian profiles', 'Fast 30-minute recipes', 'Grocery list is organized by aisle'],
        bad: ['You cannot add your own recipes', 'Free tier hides nutrition info'],
        take: 'Mealime is the app we would tell a friend to try first. It is simple, the vegan recipes are decent, and the free tier is enough for most weeks.',
      },
      {
        key: 'forks-meal-planner',
        name: 'Forks Meal Planner',
        verdict: 'Best fully plant-based',
        price: 'About $24.99 a month, $119.99 a year; two-week trial',
        format: 'Whole-food, plant-based weekly plans with batch-cooking prep',
        shipping: 'n/a',
        area: 'iOS, Android, web',
        bestFor: 'Committed whole-food plant-based eaters',
        good: ['Everything is vegan and oil-free by default', 'Weekend prep session cuts weeknight cooking to minutes', 'Allergen filters and swaps'],
        bad: ['The priciest planner here', 'Not for households mixing in meat'],
        take: 'From the Forks Over Knives people, and it shows: the plans are structured around batch cooking on Sunday. Expensive, but if you are all in on plant-based eating it pays for itself in wasted vegetables you no longer throw out.',
      },
      {
        key: 'eat-this-much',
        name: 'Eat This Much',
        verdict: 'Best for macros',
        price: 'Free basic; premium about $9 a month or $5 a month annually',
        format: 'Auto-generated plans to hit calories and macros',
        shipping: 'n/a',
        area: 'iOS, Android, web',
        bestFor: 'Athletes and anyone tracking protein on a plant-based diet',
        good: ['Generates a plan to your targets in seconds', 'Vegan and vegetarian settings', 'Premium adds grocery delivery coordination'],
        bad: ['Recipes are functional rather than lovely', 'Best set up on a desktop'],
        take: 'If your question is "how do I hit 120g of protein on plants", this is the answer. If your question is "what is nice for dinner", look elsewhere.',
      },
      {
        key: 'paprika',
        name: 'Paprika',
        verdict: 'Best for your own recipes',
        price: 'One-off, about $4.99 on mobile and $29.99 on desktop',
        format: 'Recipe manager with planner and lists; you bring the recipes',
        shipping: 'n/a',
        area: 'iOS, Android, Mac, Windows',
        bestFor: 'Cooks with a folder of favorite vegan recipes from around the web',
        good: ['Clips recipes from any site', 'No subscription', 'Aisle-sorted shopping lists'],
        bad: ['No recipe database or nutrition data', 'Paid separately per platform'],
        take: 'Paprika does not care what you eat; it organizes what you already cook. For plant-based cooks who collect recipes from blogs, it is the best few dollars you will spend.',
      },
      {
        key: 'platejoy',
        name: 'PlateJoy',
        verdict: 'Best personalized',
        price: 'Subscription; check current monthly and annual pricing',
        format: 'Personalized plans from a detailed diet and lifestyle quiz',
        shipping: 'n/a',
        area: 'iOS, Android, web',
        bestFor: 'Households with several diets to satisfy at one table',
        good: ['Handles vegan alongside other preferences in one plan', 'Portion sizes by person', 'Grocery delivery integration'],
        bad: ['Pricier than Mealime', 'Quiz is long'],
        take: 'PlateJoy earns its keep in mixed households. If one of you is vegan and one is not, it plans meals that work for both without cooking twice.',
      },
    ],
    howWeChose: [
      'We tested how many genuinely vegan recipes each planner surfaces in a week.',
      'Free tiers were used as a real person would, not the premium demo.',
      'Grocery list quality mattered as much as recipe quality.',
    ],
    faq: [
      { q: 'Is there a free vegan meal planner?', a: 'Mealime has a solid free tier with a vegan profile, and Eat This Much offers free basic plans. Forks Meal Planner is paid after a two-week trial.' },
      { q: 'Do meal planning apps work with a CSA box?', a: 'Paprika and Mealime work best: plan around what arrived rather than generating a list. Planners that auto-generate menus assume you shop from scratch.' },
    ],
    related: ['plant-based-meal-kits', 'organic-produce-delivery'],
  },
]

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug) ?? null
}
