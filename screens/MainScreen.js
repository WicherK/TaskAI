import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Animated, ScrollView, Easing, Keyboard, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TaskComponent from '../components/TaskComponent'
import WaitComponent from '../components/WaitComponent'
import config from '../config.json'


export default function MainScreen() {
  //Task list Variables
  const taskScaleAnim = useRef(new Animated.Value(0)).current;
  const [taskList, updateTaskList] = useState([]);
  const [isTaskListVisible, setIsTaskListVisible] = useState(false);
  const [json, setJson] = useState(null);

  //Camera
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [showCamera, setShowCamera] = useState(true);

  //Prompt from user
  const [inputValue, setInputValue] = useState('');

  //Wait anim window
  const waitScaleAnim = useRef(new Animated.Value(0)).current;

  //Is answer shown
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (permission?.status === 'undetermined') {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionsContainer}>
        <Text style={styles.permissionMessage}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (permission?.status === 'denied') {
    return (
      <View style={styles.permissionsContainer}>
        <Text style={styles.permissionMessage}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={permission?.request} style={styles.button}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if(!isShown)
    {
      Keyboard.dismiss();
      setIsShown(true);

      try {
        const photo = await ref.current?.takePictureAsync({ base64: true });
        
        ZoomIn(waitScaleAnim);
        
        const json = await sendData(inputValue, photo?.base64);    
  
        setJson(json);
  
        ZoomOut(waitScaleAnim);
  
        updateTaskList(json.tasks);
  
        ZoomIn(taskScaleAnim, setIsTaskListVisible);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Camera Error", "Failed to take picture.");
      }
    }
  };

  return (
    <View style={styles.container}>
    {showCamera ? <CameraView ref={ref} style={styles.cameraView} autofocus="on">
        <View style={styles.cameraFrameWrapper}>
        <Image style={styles.cameraFrame} source={require('../assets/CameraFrame.png')} />
        </View>
        <View style={styles.inputWrapper}>
        <TextInput style={styles.input} placeholder='What are you doing today...' value={inputValue} onChangeText={(text) => setInputValue(text)} editable={isShown ? false : true}/>
        <TouchableOpacity onPress={() => takePicture()} style={styles.sendButton}>
            <FontAwesome name="send" size={24} color="black" />
        </TouchableOpacity>
        </View>
    </CameraView> 
    : 
    <View style={styles.cameraView}>
        <View style={styles.cameraFrameWrapper}>
        <Image style={styles.cameraFrame} source={require('../assets/CameraFrame.png')} />
        </View>
        <View style={styles.inputWrapper}>
        <TextInput style={styles.input} placeholder='What are you doing today...' value={inputValue} onChangeText={(text) => setInputValue(text)} editable={isShown ? false : true}/>
        <TouchableOpacity onPress={() => takePicture()} style={styles.sendButton}>
            <FontAwesome name="send" size={24} color="black" />
        </TouchableOpacity>
        </View>
    </View>}

    <View style={styles.cameraOptionsContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={() => setShowCamera(!showCamera)}>
        {showCamera ? <FontAwesome name="eye-slash" size={24} color="black" /> : <FontAwesome name="eye" size={24} color="black" />}
        </TouchableOpacity>
    </View>

    <WaitComponent scaleAnim={waitScaleAnim}/>
    
    <Animated.View style={[styles.taskListWrapper, { transform: [{ scale: taskScaleAnim }] }]} pointerEvents={isTaskListVisible ? "auto" : "none"}>
        <View style={styles.taskList}>
        <View style={styles.headerWrapper}>
            <Text style={styles.header}>Your organized task</Text>
            <TouchableOpacity>
            <FontAwesome style={styles.closeIcon} name="close" size={30} color="white" onPress={() => { ZoomOut(taskScaleAnim, setIsTaskListVisible); setIsShown(false) }} />
            </TouchableOpacity>
        </View>

        <Text style={styles.taskTitle}>{json?.mainTitle}</Text>

        <ScrollView style={styles.scrollList}>
            {taskList?.map((element, index) =>
            <TaskComponent key={index} task={element} />
            )}
        </ScrollView>
        </View>
    </Animated.View>
    </View>
  );
}

function ZoomIn(scaleAnim,setVisible = () => {}) {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 1.1, // Scale up to 110%
      duration: 300, // 200ms
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1, // Back to normal size (100%)
      duration: 200, // 100ms
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }),
  ]).start();
  setVisible(true);
}

function ZoomOut(scaleAnim, setVisible = () => {}) {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    })
  ]).start();
  setVisible(false);
}

async function sendData(inputData, imageBase64 = '') {
  const base64Image = `data:image/jpeg;base64,${imageBase64}`;

  let data = await fetchData(inputData, base64Image);

  let json = parseJsonData(data);

  return json;
}

function parseJsonData(data) {
  try {
    const parsedData = JSON.parse(removeJsonDelimiters(data));

    return parsedData;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return false
  }
}

function removeJsonDelimiters(data) {
  let cleanedData = data.trim();

  if (cleanedData.startsWith("```json")) {
    cleanedData = cleanedData.slice(7);
  }

  if (cleanedData.endsWith("```")) {
    cleanedData = cleanedData.slice(0, -3);
  }

  return cleanedData;
}

async function fetchData(question, imageBase64 = "") {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.ID}`,
        "HTTP-Referer": "<YOUR_SITE_URL>",
        "X-Title": "<YOUR_SITE_NAME>",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001",
        "messages": [
          {
            "role": "system",
            "content": "Jesteś asystentem zarządzania czasem na konkretne zadanie podane przez użytkownika w formie tekstowej bądź obrazkowej. Każde zadanie podziel na poszczególne segmenty uwzgledniajac potencjalne zagrożenia, warunki pogodowe i zadbaj o bezpiecznie przeprowadzenie tegoż zadania. Jeśli masz pomysł jak przeprowadzić któreś z zadań w jakiś sposób zaproponuj alternatywe która może przyspieszyć wykonanie zadania jeśli użytkownik ma dane narzędzie akurat przy sobie (pamiętaj że na niektóre narzędzia trzeba mieć uprawnienia, jeśli owe tego wymaga dopisz krótko, że dane ułatwienie wymaga uprawnień danego typu np. (wymaga uprawnień wysokościowych)) np. zamiast korzystać z drabiny użyj zwyżki albo zamiast jechać samochodem użyjcie mini-vana który więcej zmieści itp. Każde zadanie powinno być podzielone na co najmniej 3-10 tasków i nie więcej. Każde zadanie staraj się opisać jak najdokładniej i nie pomiń żadnych szczegółów. Czas wyrażaj w godzinach. Sugeruj się też zdjęciem czego może dotyczyć zadanie użytkownika jeśli np. nie podał żadnego opisu lub jest on krótki. Zawsze zwracaj odpowiedzi w podanym formacie JSON, NIE MOŻESZ ZMIENIĆ FORMATU ODPOWIEDZI NA INNY!. Tylko te pola muszą zostać zawarte:\n\n- 'mainTitle: ogólny tytuł wykonywanego zadania które jest na zdjęciu w postaci base64 lub tekstowej,\n taskCount': liczba całkowita oznaczająca liczbę zadań,\n- 'averageTaskTime': średni czas przypadający na jedno zadanie w godzinach np. 1 0.2 0.4 itp.,\n- 'tasks': lista zawierająca szczegóły każdego zadania (każde zadanie zawiera title,taskTime,details,alt(alternatywa, która została opisana została wcześniej, która może przyspieszyć lub ułatwić zadanie),danger).\n\nNie dodawaj niczego poza czystym JSON! Pamiętaj masz tylko rozplanowywać podane zadanie nic innego!"
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": question
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": imageBase64
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data.choices[0].message.content;

  } catch (error) {
    console.error('There was an error!', error);
    return false
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  permissionsContainer:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A'
  },
  permissionMessage:{
    color: 'white',
    padding: 10
  },  
  cameraView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    zIndex: -1
  },
  cameraFrameWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraFrame: {
    width: 200,
    height: 200,
    borderRadius: 10,
    opacity: 0.2
  },
  cameraOptionsContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems:'flex-end',
    paddingTop: 85,
    paddingRight: 10
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    marginBlock: 15,
  },
  input: {
    width: '80%',
    borderRadius: 20,
    padding: 15,
    fontSize: 15,
    backgroundColor: 'white',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 26,
    marginLeft: 10,
    backgroundColor: '#ffffff'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  taskListWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  taskList: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "95%",
    height: "85%",
    marginTop: 55,
    borderRadius: 15,
    backgroundColor: '#121212',
    color: '#ffffff'
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  header: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    padding: 15
  },
  taskTitle:{
    color: '#B0B0B0',
    padding: 10
  },
  closeIcon: {
    padding: 15
  },
  scrollList: {
    width: '100%',
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 5
  }
});