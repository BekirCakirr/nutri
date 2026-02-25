import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  daysToShow?: number
  style?: ViewStyle
}

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt']
const MONTH_NAMES = [
  'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
  'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik',
]

const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate()

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  daysToShow = 7,
  style,
}) => {
  const today = new Date()
  const startOffset = Math.floor(daysToShow / 2)

  const dates: Date[] = []
  for (let i = -startOffset; i <= startOffset; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.monthLabel}>
        {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate)
          const isToday = isSameDay(date, today)
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateChange(date)}
              style={[styles.dateItem, isSelected && styles.dateItemSelected]}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.dayName, isSelected && styles.dayNameSelected]}
              >
                {DAY_NAMES[date.getDay()]}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected,
                  isToday && !isSelected && styles.dayNumberToday,
                ]}
              >
                {date.getDate()}
              </Text>
              {isToday && <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.sm,
  },
  monthLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    minWidth: 48,
  },
  dateItemSelected: {
    backgroundColor: colors.primary.main,
  },
  dayName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  dayNumberToday: {
    color: colors.primary.main,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.main,
    marginTop: spacing.xs,
  },
  todayDotSelected: {
    backgroundColor: '#FFFFFF',
  },
})
