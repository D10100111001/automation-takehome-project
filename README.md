# automation-takehome-project

Project for candidates to complete as a hiring assessment.


## Getting Started

1. `yarn install`
2. `yarn build`
2. `yarn start <marketplace> [query]` - e.g. `yarn start amazon 'laptop'` or `yarn start ebay 'laptop'`

### Optional Env Vars
`APP_MAX_RETRY_ATTEMPT` - Amount of times to retry scraping in case of failure. Default: `3`
`APP_PRODUCT_CSV_PATH` - CSV Path of scraped product data. Default: `./out/products.csv`
`APP_BROWSER_HEADLESS` - Whether to run the browser in headless mode. Default: `true`
`APP_BROWSER_LAUNCH_TIMEOUT_MS` - Playwright browser launch timeout value in milliseconds. Default: `30000`
`APP_PAGE_DEFAULT_TIMEOUT_MS` - Playwright page default timeout value in milliseconds. Default: `30000`
`APP_PAGE_NAVIGATION_TIMEOUT_MS` - Playwright page navigation timeout value in milliseconds. Default: `30000`

## Instructions

1. Fork repo to your own project.
2. Send link to the forked repo by the provided due date.

## Project Requirements

The objective is to build an automation application, meaning a program that performs a manual workflow in a repeatable manner. It must meet the following requirements:

1. Use Node.js, Typescript, and the [Playwright](https://playwright.dev/) library. **IMPORTANT: Playwright should be used to facilitate the web automation, not for testing purposes.**
2. Navigate to https://amazon.com
3. Finds the three lowest prices for any given search term
4. Write these products' to a CSV locally where each row contains product, price, search term, and link to the product's page.
5. The design should be generalized enough so that the framework can be applied to another e-commerce site with relative ease and minimal re-work.
6. Should utilize Typescript features where helpful.
7. Should run successfully during the review session.
8. Focus on maintainability and scalability.

### Extra Credit

1. Introduce a set of tests around the project
