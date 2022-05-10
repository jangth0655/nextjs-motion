export const deleteImageFile = async (imageId: string | null) => {
  return await (
    await fetch(`/api/deleteImage`, {
      method: "DELETE",
      body: `${imageId}`,
    })
  ).json();
};
