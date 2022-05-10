export const deliveryFile = (imageId?: string | null, small?: string) => {
  return small
    ? `https://imagedelivery.net/h3kJx8b63YkXouCAFpwF5w/${imageId}/public`
    : `https://imagedelivery.net/h3kJx8b63YkXouCAFpwF5w/${imageId}/public`;
};
