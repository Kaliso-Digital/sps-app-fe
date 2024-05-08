export const companyTypeData = [
  { id: 1, name: "Private" },
  { id: 2, name: "Company" },
];

export const roleData = [
  { id: 1, name: "SPS Admin" },
  { id: 2, name: "SPS User" },
  { id: 3, name: "Supplier" },
  { id: 4, name: "Customer" },
];

export const shippingTypeData = [
  {
    id: 1,
    name: "UPS Express",
  },
  {
    id: 2,
    name: "UPS Expeditter",
  },
  {
    id: 3,
    name: "Air DDP",
  },
  {
    id: 4,
    name: "Sea DDP",
  },
  {
    id: 5,
    name: "Truck DDP",
  },
];

export const stageData = [
  { id: 1, name: "New" },
  { id: 2, name: "Under Review" },
  { id: 3, name: "Invoiced" },
  { id: 4, name: "Accepted" },
  { id: 5, name: "Procurement In Progress" },
  { id: 6, name: "Goods In House (Partially)" },
  { id: 7, name: "Goods In House (Fully)" },
  { id: 8, name: "Fulfilled" },
  { id: 9, name: "Cancelled" },
  { id: 10, name: "Closed" },
  { id: 11, name: "Paid" },
];

export const serviceData = [
  {
    id: 1,
    name: "SPS Fulfillment",
  },
  {
    id: 2,
    name: "Goods to my warehouse",
  },
  {
    id: 3,
    name: "Amazon FBA",
  },
];

export const categoriesData = {
  1: {
    id: 1,
    name: "Electronic & Devices",
    subcategories: [
      { id: 3, name: "Camera & Photo" },
      { id: 4, name: "Cell Phones & Accessories" },
      { id: 5, name: "Consumer Electronics" },
      { id: 1, name: "Device Accessories" },
      { id: 2, name: "Kindle & Tablets" },
      { id: 6, name: "Personal Computers" },
    ],
  },
  2: {
    id: 2,
    name: "Automotive, Powersports & Industrial",
    subcategories: [
      { id: 7, name: "Automotive & Powersports" },
      { id: 8, name: "Industrial & Scientific" },
      { id: 9, name: "Tools & Home Improvement" },
    ],
  },
  3: {
    id: 3,
    name: "Home, Garden & Appliances",
    subcategories: [
      { id: 10, name: "Home & Garden" },
      { id: 12, name: "Kitchen" },
      { id: 11, name: "Major Appliances" },
    ],
  },
  4: {
    id: 4,
    name: "Beauty, Health & Personal Care",
    subcategories: [
      { id: 13, name: "Beauty" },
      { id: 14, name: "Health & Personal Care" },
    ],
  },
  5: {
    id: 5,
    name: "Baby, Toys & Games",
    subcategories: [
      { id: 15, name: "Baby Products" },
      { id: 16, name: "Toys & Games" },
    ],
  },
  6: {
    id: 6,
    name: "Sports, Outdoors & Collectibles",
    subcategories: [
      { id: 20, name: "Entertainment Collectibles" },
      { id: 18, name: "Outdoors" },
      { id: 17, name: "Sports" },
      { id: 19, name: "Sports Collectibles" },
    ],
  },
  7: {
    id: 7,
    name: "Books, Music & Media",
    subcategories: [
      { id: 21, name: "Books" },
      { id: 22, name: "Music and DVD" },
      { id: 24, name: "Video Games" },
      { id: 23, name: "Video, DVD & Blu-Ray" },
    ],
  },
  8: {
    id: 8,
    name: "Office, School & Art Supplies",
    subcategories: [
      { id: 27, name: "Fine Art" },
      { id: 26, name: "Musical Instruments" },
      { id: 25, name: "Office Products" },
    ],
  },
  9: {
    id: 9,
    name: "Groceries & Gourmet Foods",
    subcategories: [{ id: 28, name: "Grocery * Gourmet Foods" }],
  },
  10: {
    id: 10,
    name: "Pets & Animal Supplies",
    subcategories: [{ id: 29, name: "Pet Supplies" }],
  },
  11: {
    id: 11,
    name: "Fashion & Accessories",
    subcategories: [
      { id: 30, name: "Clothing, Shoes and Jewelry" },
      { id: 32, name: "Men's Accessories" },
      { id: 34, name: "Unisex Accessories" },
      { id: 31, name: "Watches" },
      { id: 33, name: "Women's Accessories" },
    ],
  },
};
