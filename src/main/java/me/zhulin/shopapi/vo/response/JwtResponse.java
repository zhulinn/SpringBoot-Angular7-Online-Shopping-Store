package me.zhulin.shopapi.vo.response;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Created By Zhu Lin on 1/1/2019.
 */
@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String account;
    private String name;
    private Collection<? extends GrantedAuthority> authorities;

    public JwtResponse(String token, String account, String name, Collection<? extends GrantedAuthority> authorities) {
        this.account = account;
        this.name = name;
        this.token = token;
        this.authorities = authorities;
    }
}
