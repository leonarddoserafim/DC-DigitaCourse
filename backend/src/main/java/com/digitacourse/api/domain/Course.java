package com.digitacourse.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(name = "short_title", nullable = false, length = 80)
    private String shortTitle;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false, length = 40)
    private String level;

    @Column(nullable = false, length = 20)
    private String tone;

    @Column(nullable = false)
    private int duration;

    @Column(nullable = false, length = 80)
    private String focus;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;
}
