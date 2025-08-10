import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface RadioOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioSelectorProps<T = string> {
  icon?: React.ReactNode;
  label: string;
  value?: T;
  options: RadioOption<T>[];
  onSelect: (value: T) => void;
  modalTitle?: string;
  modalDescription?: string;
  placeholder?: string;
}

export function ThemedRadioSelector<T extends string = string>({
  icon,
  label,
  value,
  options,
  onSelect,
  modalTitle,
  modalDescription,
  placeholder = 'Chọn một tùy chọn',
}: RadioSelectorProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({ light: 'white', dark: '#3A3A3A' }, 'background');
  const borderColor = useThemeColor({ light: '#EEEEEF', dark: '#4A4A4A' }, 'border');
  const textColor = useThemeColor({ light: '#333', dark: '#FFF' }, 'text');
  const labelColor = useThemeColor({ light: '#999', dark: '#AAA' }, 'text');
  const labelWithValueColor = useThemeColor({ light: '#666', dark: '#CCC' }, 'text');
  const iconColor = useThemeColor({ light: '#999', dark: '#AAA' }, 'icon');
  const modalBgColor = useThemeColor({ light: 'white', dark: '#2A2A2A' }, 'background');
  const overlayColor = useThemeColor({ light: 'rgba(0,0,0,0.5)', dark: 'rgba(0,0,0,0.7)' }, 'background');
  const descriptionColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const selectedBgColor = useThemeColor({ light: '#F0F0F0', dark: '#404040' }, 'background');
  const radioActiveColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'icon');

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: T) => {
    onSelect(optionValue);
    setModalVisible(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.container, { backgroundColor, borderColor }]}
        onPress={() => setModalVisible(true)}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={[
            styles.label,
            { color: labelColor },
            value !== undefined && { color: labelWithValueColor }
          ]}>
            {label}
          </Text>
          {selectedOption && (
            <Text style={[styles.value, { color: textColor }]}>
              {selectedOption.label}
            </Text>
          )}
        </View>
        <AntDesign name="right" size={18} color={iconColor} />
      </TouchableOpacity>

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: overlayColor }]}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalWrapper}>
            <Pressable style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {modalTitle || 'Chọn đối tượng'}
                </Text>
                {modalDescription && (
                  <Text style={[styles.modalSubtitle, { color: descriptionColor }]}>
                    {modalDescription}
                  </Text>
                )}
              </View>

              {/* Options List */}
              <View style={styles.optionsList}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      value === option.value && { backgroundColor: selectedBgColor }
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      {option.icon && (
                        <View style={styles.optionIcon}>
                          {option.icon}
                        </View>
                      )}
                      <View style={styles.optionTextContainer}>
                        <Text style={[styles.optionLabel, { color: textColor }]}>
                          {option.label}
                        </Text>
                        {option.description && (
                          <Text style={[styles.optionDescription, { color: descriptionColor }]}>
                            {option.description}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Modal indicator bar */}
              <View style={styles.modalIndicator}>
                <View style={[styles.modalIndicatorBar, { backgroundColor: borderColor }]} />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Account for safe area
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  optionsList: {
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  optionItem: {
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionIcon: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  modalIndicator: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  modalIndicatorBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});