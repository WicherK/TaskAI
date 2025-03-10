import { StyleSheet, Text, View } from 'react-native';

function Task(props) {
    return(
        <View style={styles.task}>
            <Text style={styles.taskTitle}>{props.task?.title}</Text>
            <View style={styles.taskDescriptions}>
                <View style={styles.taskDescription}><Text style={styles.taskDescriptionHeaders}>Czas:</Text><Text style={styles.taskDescriptionContent}>{parseTaskTime(props.task?.taskTime)}</Text></View>
                <View style={styles.taskDescription}><Text style={styles.taskDescriptionHeaders}>Szczegóły:</Text><Text style={styles.taskDescriptionContent}>{props.task?.details}</Text></View>
                <View style={styles.taskDescription}><Text style={styles.taskDescriptionHeaders}>Alternatywa:</Text><Text style={styles.taskDescriptionContent}>{props.task?.alt}</Text></View>
                <View style={styles.taskDescription}><Text style={styles.taskDescriptionHeaders}>Zagrożenia:</Text><Text style={styles.taskDescriptionContent}>{props.task?.danger}</Text></View>
            </View>
        </View>
    );
}

function parseTaskTime(hours) {
    if (hours <= 0) return "Less than a minute";

    const totalMinutes = Math.round(hours * 60);
    const totalHours = Math.round(hours);
    const totalDays = Math.floor(hours / 24);
    const totalYears = Math.floor(totalDays / 365);

    if (totalMinutes < 60) {
        return `${totalMinutes} minutes`;
    }

    if (totalHours < 24) {
        const remainingMinutes = totalMinutes % 60;
        return remainingMinutes === 0 
            ? `${totalHours} hour${totalHours > 1 ? 's' : ''}` 
            : `${totalHours} hour${totalHours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
    }

    if (totalDays < 365) {
        const remainingHours = totalHours % 24;
        return remainingHours === 0 
            ? `${totalDays} day${totalDays > 1 ? 's' : ''}` 
            : `${totalDays} day${totalDays > 1 ? 's' : ''} ${remainingHours} hours`;
    }

    const remainingDays = totalDays % 365;
    return remainingDays === 0 
        ? `${totalYears} year${totalYears > 1 ? 's' : ''}` 
        : `${totalYears} year${totalYears > 1 ? 's' : ''} ${remainingDays} days`;
}

const styles = StyleSheet.create({
    task:{
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        marginBottom: 20
    },
    taskTitle:{
        color: 'white',
        width: '100%',
        padding: 10,
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold'
    },
    taskDescriptions:{
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15
    },
    taskDescription:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 2
    },
    taskDescriptionHeaders:{
        color: '#B0B0B0',
        fontWeight: 'bold',
        fontSize: 14,
        width: '22%'
    },
    taskDescriptionContent:{
        flex: 1,
        color: '#B0B0B0',
        marginLeft: 8,
        textAlign: 'justify',
        flexShrink: 1
    }
});

export default Task;