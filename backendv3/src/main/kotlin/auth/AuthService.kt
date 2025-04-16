package com.example.auth

import com.example.models.dtos.LoginRequest
import com.example.models.dtos.RegisterRequest
import com.example.models.dtos.TokenResponse
import com.example.models.dtos.UserResponse
import com.example.repositories.UserRepository
import org.mindrot.jbcrypt.BCrypt

class AuthService(private val userRepository: UserRepository, private val jwtService: JwtService) {
    
    fun register(request: RegisterRequest): UserResponse {
        val existingUsers = userRepository.getAll()
        val userExists = existingUsers.any { it.email == request.email }
        
        if (userExists) {
            throw IllegalArgumentException("User with this email already exists")
        }
        
        val hashedPassword = BCrypt.hashpw(request.password, BCrypt.gensalt())
        
        val userId = userRepository.createAndGetId(
            com.example.models.dtos.BasicUser(
                name = request.name,
                email = request.email,
                password = hashedPassword
            )
        )
        
        return UserResponse(
            id = userId,
            name = request.name,
            email = request.email
        )
    }
    
    fun login(request: LoginRequest): TokenResponse? {
        val users = userRepository.getAll()
        val user = users.find { it.email == request.email }
        
        if (user != null && BCrypt.checkpw(request.password, user.password)) {
            val token = jwtService.generateToken(user.id!!, user.email)
            
            return TokenResponse(
                token = token,
                userId = user.id,
                email = user.email,
                name = user.name
            )
        }
        
        return null
    }
    
    fun getUserById(id: Int): UserResponse? {
        val user = userRepository.getById(id) ?: return null
        
        return UserResponse(
            id = user.id!!,
            name = user.name,
            email = user.email
        )
    }
}