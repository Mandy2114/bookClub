const clubImages = document.querySelectorAll(".club-images");

clubImages.forEach((club) => {
  club.addEventListener("click", (e) => {
    const clubId = e.target.dataset.clubid;

    localStorage.setItem('lastClubId', clubId);

    window.location.href = `/clubs/${clubId}`;
  });
});
