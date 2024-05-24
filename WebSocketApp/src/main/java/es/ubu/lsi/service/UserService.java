package es.ubu.lsi.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private Map<String, String> users = new HashMap<>();
    private Map<String, Integer> usersLevel = new HashMap<>();
    
    /**
     * UserService init().
     * 
     * Initialize the list of users, password and level from the csv.
     * 
     */
    @PostConstruct
    public void init() {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/csv/usuarios.csv")))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] fields = line.split(",");
                if (fields.length == 3) {
                    String username = fields[0].trim();
                    String password = fields[1].trim();
                    int level = Integer.parseInt(fields[2].trim());
                    // Store username and password
                    users.put(username, password);
                    usersLevel.put(username, level);

                }
            }
            System.out.println("---- Listado de usuarios: " + users + "  -----");
            System.out.println("---- Listado de niveles: " + usersLevel + "  -----");
        } catch (IOException e) {
            e.toString();
        }
    }

    /**
     * Method userIsValid().
     * 
     * @param username
     * @param password
     * @return true or false
     */
    public boolean userIsValid(String username, String password) {
        return users.containsKey(username) && users.get(username).equals(password);
    }
    
    /**
     * Method userLevel().
     * @param username
     * @return string - level of the user
     */
    public int userLevel(String username) {
        return usersLevel.get(username);
    }
}

