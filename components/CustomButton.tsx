import React from 'react';
import { TouchableOpacity, View,Text, ActivityIndicator } from 'react-native';
import {CustomButtonProps} from '@/type'
import cn from 'clsx'
const CustomButton = ({ 
    title="Click Me",
     onPress ,
    style,
    textStyle,
    leftIcon,
    isLoading,
    
    }: CustomButtonProps) => {
  return (
    <TouchableOpacity 
      className={cn('custom-btn',style) }  onPress={onPress} >
{leftIcon}
<View className='flex-center flex-row '>
    {isLoading? (
        <ActivityIndicator  size="small" color="white" />
):(
<Text className={cn("text-white-100 paragraph-semibold" ,textStyle)}>{title}</Text>
)}
</View>
    </TouchableOpacity>
  );
};

export default CustomButton;