import {NavigationProp} from '@react-navigation/native';

type ScreenNames = ['Homepage', 'NowPlaying', 'MovieDetail'];

export type RootStackParamList = Record<
  ScreenNames[number],
  {movieId?: number}
>;
export type StackNavigation = NavigationProp<RootStackParamList>;
