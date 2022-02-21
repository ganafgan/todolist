import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Primary, White, white } from './utils/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { clearStorage, getData, storeData } from './utils/Storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StepIndicator from 'react-native-step-indicator';

const App = () => {

	const [textInput, setTextInput] = useState('')
	const [todos, setTodos] = useState([])
	
	useEffect(() => {
		getTodosfromDevice()
	}, [])

	useEffect(() => {
		saveTodoToDevice(todos)
	}, [todos])

	const renderListItem = ({item}) => {
		return(
			<View style={styles.listItem}>
				<View style={{flex: 1}}>
					<Text style={{fontWeight: 'bold', fontSize: 15, color: Primary, textDecorationLine: item?.completed ? 'line-through' : 'none' }}>{item?.task}</Text>
				</View>
				{
					!item?.completed && (
						<TouchableOpacity style={[styles.actonIcon]} onPress={() => markTodoCompleted(item.id)}>
							<Icon name='done' size={20} color={White}/>
						</TouchableOpacity>
					)
				}
				<TouchableOpacity onPress={() => deleteTodo(item.id)} style={[styles.actonIcon, {backgroundColor: 'red', marginLeft: 10}]}>
					<Icon name='delete' size={20} color={White}/>
				</TouchableOpacity>
			</View>
		)
	}

	const saveTodoToDevice =  async (todos) => {
		try {
			console.log('ini todos', todos)
			await storeData('todos', todos)
		} catch (error) {
			console.log(error)
		}
	}

	const getTodosfromDevice = async () => {
		try {
			const todos = await getData('todos')
			console.log(todos)
			if(todos){
				setTodos(todos)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const addTodo = () => {
		if(textInput == ''){
			Alert.alert('Todo can"t be empty')
		} else {
			const newTodo = {
				id: Math.random(),
				task: textInput,
				completed: false
			}
			setTodos([...todos, newTodo])
			setTextInput('')
		}
	}

	const markTodoCompleted = (id) => {
		
		const newTodos = todos.map((item) => {
			if(item.id == id){
				return {...item, completed: true}
			}
			return item;
		})
		setTodos(newTodos)
	}

	const deleteTodo = (id) => {

		const newTodos = todos.filter((item) => item.id != id)
		setTodos(newTodos)

	}

	const clearTodos = async () => {
		
		await AsyncStorage.clear(),
		await getTodosfromDevice()
			
	}


	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>TODO APP</Text>
				<Icon name='delete' size={25} color='red' onPress={clearTodos}/>
			</View>
			<FlatList
				data={todos}
				renderItem={renderListItem}
				contentContainerStyle={{padding: 20, paddingBottom: 100}}
			/>
			<View style={styles.footer}>
				<View style={styles.inputcontainer}>
					<TextInput
						placeholder='Add Todo'
						onChangeText={(text) => setTextInput(text)}
						value={textInput}
					/>
				</View>
				<TouchableOpacity onPress={addTodo}>
					<View style={styles.iconContainer}>
						<Icon name='add' size={25} color={White}/>
					</View>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

export default App

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: White
	},
	header: {
		padding: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Primary
	},
	actonIcon: {
		height: 25,
		width: 25,
		backgroundColor: 'green',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 5,
		borderRadius: 3
	},
	listItem: {
		padding: 20,
		backgroundColor: White,
		flexDirection: 'row',
		elevation: 12,
		borderRadius:10,
		marginVertical: 10
	},
	footer: {
		position: 'absolute',
		bottom: 0,
		color: White,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	inputcontainer: {
		flex: 1,
		backgroundColor: White,
		width: '100%',
		height: 50,
		elevation: 12,
		marginVertical: 20,
		marginRight: 20,
		borderRadius: 10,
		paddingHorizontal: 20
	},
	iconContainer: {
		height: 50,
		width: 50,
		borderRadius: 50/2,
		backgroundColor: Primary,
		alignItems: 'center',
		justifyContent: 'center'
	}
})