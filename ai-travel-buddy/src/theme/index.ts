import { colors, Colors } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
}

export const theme: Theme = {
  colors,
  typography,
  spacing,
};

export { colors, typography, spacing };
