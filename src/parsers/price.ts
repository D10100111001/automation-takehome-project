// TODO: Better way to parse price from text as the fractional part could be delimited by commas or spaces
const PRICE_REGEX = /(\$|\€)(\d+\.\d+)/;

export const parsePrice = (text: string) => {
  const matches = text?.match(PRICE_REGEX);
  if (matches == null) return null;

  const [currency, priceStr] = matches.slice(1);
  const price = priceStr ? parseFloat(priceStr) : null;

  return {
    currency,
    price,
  };
};
