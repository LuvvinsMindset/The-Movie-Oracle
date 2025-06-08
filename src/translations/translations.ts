interface Translations {
  [key: string]: {
    en: string;
    lv: string;
  };
}

export const translations: Translations = {
  // Header and Navigation
  appTitle: {
    en: 'The Movie Oracle',
    lv: 'The Movie Oracle'
  },
  search: {
    en: 'Search Movies & People',
    lv: 'Meklēt Filmas un Cilvēkus'
  },
  popularMovies: {
    en: 'Popular Movies',
    lv: 'Populāras Filmas'
  },
  topRatedMovies: {
    en: 'Top Rated Movies',
    lv: 'Augstāk Novērtētās Filmas'
  },
  popularPeople: {
    en: 'Popular People',
    lv: 'Populāri Cilvēki'
  },
  movieGenres: {
    en: 'Movie Genres',
    lv: 'Filmu Žanri'
  },
  genres: {
    en: 'Genres',
    lv: 'Žanri'
  },
  discover: {
    en: 'Discover',
    lv: 'Atklāt'
  },
  movies: {
    en: 'Movies',
    lv: 'Filmas'
  },

  // Movie Genres
  action: {
    en: 'Action',
    lv: 'Asa Sižeta'
  },
  adventure: {
    en: 'Adventure',
    lv: 'Piedzīvojumu'
  },
  animation: {
    en: 'Animation',
    lv: 'Animācijas'
  },
  comedy: {
    en: 'Comedy',
    lv: 'Komēdijas'
  },
  crime: {
    en: 'Crime',
    lv: 'Kriminālās'
  },
  documentary: {
    en: 'Documentary',
    lv: 'Dokumentālās'
  },
  drama: {
    en: 'Drama',
    lv: 'Drāmas'
  },
  family: {
    en: 'Family',
    lv: 'Ģimenes'
  },
  fantasy: {
    en: 'Fantasy',
    lv: 'Fantāzijas'
  },
  history: {
    en: 'History',
    lv: 'Vēsturiskās'
  },
  horror: {
    en: 'Horror',
    lv: 'Šausmu'
  },
  music: {
    en: 'Music',
    lv: 'Mūzikla'
  },
  mystery: {
    en: 'Mystery',
    lv: 'Mistērijas'
  },
  romance: {
    en: 'Romance',
    lv: 'Romantiskās'
  },
  scienceFiction: {
    en: 'Science Fiction',
    lv: 'Zinātniskās Fantastikas'
  },
  tvMovie: {
    en: 'TV Movie',
    lv: 'TV Filmas'
  },
  thriller: {
    en: 'Thriller',
    lv: 'Trilleris'
  },
  war: {
    en: 'War',
    lv: 'Kara'
  },
  western: {
    en: 'Western',
    lv: 'Vesternas'
  },

  // Sidebar Categories
  discoverMovies: {
    en: 'Discover Movies',
    lv: 'Atklājiet Filmas'
  },
  nowPlaying: {
    en: 'Now Playing',
    lv: 'Šobrīd Kinoteātros'
  },
  upcoming: {
    en: 'Upcoming',
    lv: 'Drīzumā'
  },

  // Sort Options
  sortBy: {
    en: 'Sort By',
    lv: 'Kārtot Pēc'
  },
  popularity: {
    en: 'Popularity',
    lv: 'Popularitātes'
  },
  popularityAsc: {
    en: 'Popularity Ascending',
    lv: 'Popularitāte Augošā secībā'
  },
  popularityDesc: {
    en: 'Popularity Descending',
    lv: 'Popularitāte Dilstoši'
  },
  releaseDate: {
    en: 'Release Date',
    lv: 'Izdošanas Datums'
  },
  releaseDateAsc: {
    en: 'Release Date Ascending',
    lv: 'Izdošanas Datums Augoši'
  },
  releaseDateDesc: {
    en: 'Release Date Descending',
    lv: 'Izdošanas Datums Dilstoši'
  },
  rating: {
    en: 'Rating',
    lv: 'Vērtējums'
  },
  ratingAsc: {
    en: 'Rating Ascending',
    lv: 'Vērtējums Augoši'
  },
  ratingDesc: {
    en: 'Rating Descending',
    lv: 'Vērtējums Dilstoši'
  },
  title: {
    en: 'Title',
    lv: 'Nosaukums'
  },
  titleAsc: {
    en: 'Title A-Z',
    lv: 'Nosaukums A-Z'
  },
  titleDesc: {
    en: 'Title Z-A',
    lv: 'Nosaukums Z-A'
  },
  oldestMovies: {
    en: 'Release Date (Oldest)',
    lv: 'Izdošanas Datums (Vecākās)'
  },

  // Auth & User
  login: {
    en: 'Login',
    lv: 'Ieiet'
  },
  register: {
    en: 'Register',
    lv: 'Reģistrēties'
  },
  logout: {
    en: 'Logout',
    lv: 'Iziet'
  },
  email: {
    en: 'Email',
    lv: 'E-pasts'
  },
  password: {
    en: 'Password',
    lv: 'Parole'
  },
  currentPassword: {
    en: 'Current Password',
    lv: 'Pašreizējā Parole'
  },
  newPassword: {
    en: 'New Password',
    lv: 'Jaunā Parole'
  },
  username: {
    en: 'Username',
    lv: 'Lietotājvārds'
  },
  currentUsername: {
    en: 'Current Username',
    lv: 'Pašreizējais Lietotājvārds'
  },
  newUsername: {
    en: 'New Username',
    lv: 'Jaunais Lietotājvārds'
  },

  // Settings Page
  settings: {
    en: 'Settings',
    lv: 'Iestatījumi'
  },
  profile: {
    en: 'Profile',
    lv: 'Profils'
  },
  security: {
    en: 'Security',
    lv: 'Drošība'
  },
  changeUsername: {
    en: 'Change Username',
    lv: 'Mainīt Lietotājvārdu'
  },
  changePassword: {
    en: 'Change Password',
    lv: 'Mainīt Paroli'
  },
  adminControls: {
    en: 'Admin Controls',
    lv: 'Administratora Vadība'
  },
  userEmail: {
    en: 'User Email',
    lv: 'Lietotāja E-pasts'
  },
  newRole: {
    en: 'New Role (user/admin)',
    lv: 'Jaunā Loma (user/admin)'
  },
  updateRole: {
    en: 'Update Role',
    lv: 'Atjaunināt Lomu'
  },
  deleteUser: {
    en: 'Delete',
    lv: 'Dzēst'
  },
  noUsers: {
    en: 'No users found',
    lv: 'Lietotāji nav atrasti'
  },

  // Movie Details
  overview: {
    en: 'Overview',
    lv: 'Apraksts'
  },
  movieCast: {
    en: 'Cast',
    lv: 'Filmas dalībnieki'
  },
  personCast: {
    en: 'Cast',
    lv: 'Filmas kurās piedalās aktieris'
  },
  crew: {
    en: 'Crew',
    lv: 'Filmēšanas Grupa'
  },
  videos: {
    en: 'Videos',
    lv: 'Video'
  },
  images: {
    en: 'Images',
    lv: 'Attēli'
  },
  recommendations: {
    en: 'Recommendations',
    lv: 'Ieteikumi'
  },
  minutes: {
    en: 'minutes',
    lv: 'minūtes'
  },
  director: {
    en: 'Director',
    lv: 'Režisors'
  },

  // Favorites
  favorites: {
    en: 'Favorites',
    lv: 'Favorīti'
  },
  favoriteMovies: {
    en: 'Favorite Movies',
    lv: 'Iecienītās Filmas'
  },
  favoriteActors: {
    en: 'Favorite Actors',
    lv: 'Iecienītie Aktieri'
  },
  addToFavorites: {
    en: 'Add to Favorites',
    lv: 'Pievienot Favorītiem'
  },
  removeFromFavorites: {
    en: 'Remove from Favorites',
    lv: 'Noņemt no Favorītiem'
  },

  // Messages & Support
  support: {
    en: 'Support',
    lv: 'Atbalsts'
  },
  messages: {
    en: 'Messages',
    lv: 'Ziņojumi'
  },
  activity: {
    en: 'Activity',
    lv: 'Aktivitāte'
  },

  // Success/Error Messages
  passwordChanged: {
    en: 'Password changed successfully',
    lv: 'Parole veiksmīgi nomainīta'
  },
  usernameChanged: {
    en: 'Username changed successfully',
    lv: 'Lietotājvārds veiksmīgi nomainīts'
  },
  roleUpdated: {
    en: 'User role updated successfully',
    lv: 'Lietotāja loma veiksmīgi atjaunināta'
  },
  errorOccurred: {
    en: 'An error occurred',
    lv: 'Notika kļūda'
  },
  passwordError: {
    en: 'Failed to change password',
    lv: 'Neizdevās nomainīt paroli'
  },
  usernameError: {
    en: 'Failed to change username',
    lv: 'Neizdevās nomainīt lietotājvārdu'
  },
  roleError: {
    en: 'Failed to update user role',
    lv: 'Neizdevās atjaunināt lietotāja lomu'
  },

  // Person Profile
  biography: {
    en: 'Biography',
    lv: 'Biogrāfija'
  },
  personalInfo: {
    en: 'Personal Info',
    lv: 'Personīgā Informācija'
  },
  gender: {
    en: 'Gender',
    lv: 'Dzimums'
  },
  birthday: {
    en: 'Birthday',
    lv: 'Dzimšanas Diena'
  },
  placeOfBirth: {
    en: 'Place of Birth',
    lv: 'Dzimšanas Vieta'
  },
  officialSite: {
    en: 'Official Site',
    lv: 'Oficiālā Vietne'
  },
  male: {
    en: 'Male',
    lv: 'Vīrietis'
  },
  female: {
    en: 'Female',
    lv: 'Sieviete'
  },
  noImages: {
    en: 'No image has been found.',
    lv: 'Attēli nav atrasti.'
  },
  noCasting: {
    en: 'No casting has been found.',
    lv: 'Lomas nav atrastas.'
  },
  noCrew: {
    en: 'No crew info has been found.',
    lv: 'Informācija par filmēšanas grupu nav atrasta.'
  },

  // Watch Providers
  whereToWatch: {
    en: 'Where to Watch',
    lv: 'Kur Skatīties'
  },
  region: {
    en: 'Region',
    lv: 'Reģions'
  },
  stream: {
    en: 'Stream',
    lv: 'Straumēt'
  },
  rent: {
    en: 'Rent',
    lv: 'Nomāt'
  },
  buy: {
    en: 'Buy',
    lv: 'Pirkt'
  },
  noStreamingInfo: {
    en: 'No streaming information available for this region',
    lv: 'Šajā reģionā nav pieejama informācija par straumēšanu'
  },

  // Financial Information
  financials: {
    en: 'Financial Information',
    lv: 'Finanšu Informācija'
  },
  budget: {
    en: 'Budget',
    lv: 'Budžets'
  },
  revenue: {
    en: 'Revenue',
    lv: 'Ieņēmumi'
  }
}; 