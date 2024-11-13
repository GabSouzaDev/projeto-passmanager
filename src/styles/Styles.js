import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F8F8',
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      borderColor: '#CCC',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 8,
    },

    input: {
        height: 40,
        flex: 1,
        marginLeft: 10,
        paddingLeft: 8,
    },

    iconInput: {
        paddingLeft: 10,
    },

    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#CCC',
      borderRadius: 5,
      marginLeft: 11,
      paddingLeft: 8,
      flex: 1,
    },

    passwordInput: {
        flex: 1,
        height: 40,
    },

    eyeIcon: {
        padding: 10,
    },

    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },

    iconTrashService: {
        marginLeft: 20,
    },

    
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },

    //Tela de serviços

    listContainer: {
        flex: 1,
        paddingTop: 10,
    },

    listItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2},
        elevation: 3,  
    },

    listItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    listHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    listText: {
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#C0C0C0',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    
    listItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },

    servicesActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    serviceButton: {
        backgroundColor: '#28a745',
        padding: 5,
        borderRadius: 5,
    },

    serviceButtonText: {
        color: '#fff',
        fontSize: 14,
    },


    //modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

});


export default styles;