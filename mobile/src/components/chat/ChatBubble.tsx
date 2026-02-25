import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ChatBubbleProps {
  message: string
  timestamp: string
  isSent?: boolean
  isRead?: boolean
  senderName?: string
  style?: ViewStyle
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
  isSent = false,
  isRead = false,
  senderName,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        isSent ? styles.sentContainer : styles.receivedContainer,
        style,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        {!isSent && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text
          style={[
            styles.message,
            isSent ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          {message}
        </Text>
        <View style={styles.footer}>
          <Text
            style={[
              styles.timestamp,
              isSent ? styles.sentTimestamp : styles.receivedTimestamp,
            ]}
          >
            {timestamp}
          </Text>
          {isSent && (
            <Text style={styles.readStatus}>
              {isRead ? '\u2713\u2713' : '\u2713'}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  sentContainer: {
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.sm + 2,
    borderRadius: borderRadius.lg,
  },
  sentBubble: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: borderRadius.xs,
  },
  receivedBubble: {
    backgroundColor: colors.background.paper,
    borderBottomLeftRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  senderName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * 1.4,
  },
  sentMessage: {
    color: '#FFFFFF',
  },
  receivedMessage: {
    color: colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: fontSizes.xs,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTimestamp: {
    color: colors.text.disabled,
  },
  readStatus: {
    fontSize: fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: spacing.xs,
  },
})
